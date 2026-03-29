import {
  PDFDocument,
  PDFName,
  PDFString,
  PDFArray,
  PDFDict,
  PDFHexString,
  PDFStream,
  PDFRawStream,
  decodePDFRawStream,
} from "pdf-lib";

/**
 * Embed a Factur-X XML into a PDF and set PDF/A-3b metadata.
 * Runs entirely client-side (pdf-lib is browser-compatible).
 */
export async function embedFacturX(
  pdfBuffer: Uint8Array,
  xml: string,
  metadata: { title: string; author: string; subject: string },
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.load(pdfBuffer);
  const context = pdfDoc.context;

  // ── Set document info ──
  pdfDoc.setTitle(metadata.title);
  pdfDoc.setAuthor(metadata.author);
  pdfDoc.setSubject(metadata.subject);
  pdfDoc.setProducer("RentReady - Gestion Locative");
  pdfDoc.setCreator("RentReady Factur-X Generator");

  // ── Embed the XML as a file stream ──
  const xmlBytes = new TextEncoder().encode(xml);

  const embeddedFileStream = context.stream(xmlBytes, {
    Type: "EmbeddedFile",
    Subtype: "text/xml",
    Params: context.obj({
      Size: xmlBytes.length,
    }),
  });
  const embeddedFileStreamRef = context.register(embeddedFileStream);

  // ── Create file specification dictionary ──
  const fileSpecDict = context.obj({
    Type: "Filespec",
    F: PDFString.of("factur-x.xml"),
    UF: PDFHexString.fromText("factur-x.xml"),
    Desc: PDFString.of("Factur-X XML invoice data"),
    AFRelationship: "Alternative",
    EF: context.obj({
      F: embeddedFileStreamRef,
      UF: embeddedFileStreamRef,
    }),
  });
  const fileSpecRef = context.register(fileSpecDict);

  // ── Add to the document catalog's EmbeddedFiles name tree ──
  const namesDict = context.obj({
    Names: [PDFHexString.fromText("factur-x.xml"), fileSpecRef],
  });
  const namesDictRef = context.register(namesDict);

  const catalog = pdfDoc.catalog;
  const catalogNamesDict = context.obj({
    EmbeddedFiles: namesDictRef,
  });
  const catalogNamesDictRef = context.register(catalogNamesDict);
  catalog.set(PDFName.of("Names"), catalogNamesDictRef);

  // ── Set AF (Associated Files) array on catalog ──
  const afArray = context.obj([fileSpecRef]);
  catalog.set(PDFName.of("AF"), afArray);

  // ── Set PDF/A-3b conformance via XMP metadata ──
  const creationDate = new Date().toISOString();
  const xmpMetadata = buildXmpMetadata({
    title: metadata.title,
    author: metadata.author,
    subject: metadata.subject,
    producer: "RentReady - Gestion Locative",
    creator: "RentReady Factur-X Generator",
    creationDate,
  });

  const xmpBytes = new TextEncoder().encode(xmpMetadata);
  const metadataStream = context.stream(xmpBytes, {
    Type: "Metadata",
    Subtype: "XML",
    Length: xmpBytes.length,
  });
  const metadataStreamRef = context.register(metadataStream);
  catalog.set(PDFName.of("Metadata"), metadataStreamRef);

  // ── Mark as PDF/A-3b ──
  catalog.set(
    PDFName.of("MarkInfo"),
    context.obj({ Marked: true }),
  );

  return pdfDoc.save();
}

function buildXmpMetadata(info: {
  title: string;
  author: string;
  subject: string;
  producer: string;
  creator: string;
  creationDate: string;
}): string {
  const esc = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  return `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
  <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <rdf:Description rdf:about=""
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:xmp="http://ns.adobe.com/xap/1.0/"
      xmlns:pdf="http://ns.adobe.com/pdf/1.3/"
      xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/"
      xmlns:pdfaExtension="http://www.aiim.org/pdfa/ns/extension/"
      xmlns:pdfaSchema="http://www.aiim.org/pdfa/ns/schema#"
      xmlns:pdfaProperty="http://www.aiim.org/pdfa/ns/property#"
      xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">

      <!-- PDF/A-3b identification -->
      <pdfaid:part>3</pdfaid:part>
      <pdfaid:conformance>B</pdfaid:conformance>

      <!-- Dublin Core -->
      <dc:title>
        <rdf:Alt><rdf:li xml:lang="x-default">${esc(info.title)}</rdf:li></rdf:Alt>
      </dc:title>
      <dc:creator>
        <rdf:Seq><rdf:li>${esc(info.author)}</rdf:li></rdf:Seq>
      </dc:creator>
      <dc:description>
        <rdf:Alt><rdf:li xml:lang="x-default">${esc(info.subject)}</rdf:li></rdf:Alt>
      </dc:description>

      <!-- XMP -->
      <xmp:CreatorTool>${esc(info.creator)}</xmp:CreatorTool>
      <xmp:CreateDate>${info.creationDate}</xmp:CreateDate>
      <xmp:ModifyDate>${info.creationDate}</xmp:ModifyDate>

      <!-- PDF producer -->
      <pdf:Producer>${esc(info.producer)}</pdf:Producer>

      <!-- Factur-X extension schema -->
      <pdfaExtension:schemas>
        <rdf:Bag>
          <rdf:li rdf:parseType="Resource">
            <pdfaSchema:schema>Factur-X PDFA Extension Schema</pdfaSchema:schema>
            <pdfaSchema:namespaceURI>urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#</pdfaSchema:namespaceURI>
            <pdfaSchema:prefix>fx</pdfaSchema:prefix>
            <pdfaSchema:property>
              <rdf:Seq>
                <rdf:li rdf:parseType="Resource">
                  <pdfaProperty:name>DocumentFileName</pdfaProperty:name>
                  <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                  <pdfaProperty:category>external</pdfaProperty:category>
                  <pdfaProperty:description>Name of the embedded XML invoice file</pdfaProperty:description>
                </rdf:li>
                <rdf:li rdf:parseType="Resource">
                  <pdfaProperty:name>DocumentType</pdfaProperty:name>
                  <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                  <pdfaProperty:category>external</pdfaProperty:category>
                  <pdfaProperty:description>INVOICE</pdfaProperty:description>
                </rdf:li>
                <rdf:li rdf:parseType="Resource">
                  <pdfaProperty:name>Version</pdfaProperty:name>
                  <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                  <pdfaProperty:category>external</pdfaProperty:category>
                  <pdfaProperty:description>The actual version of the Factur-X XML schema</pdfaProperty:description>
                </rdf:li>
                <rdf:li rdf:parseType="Resource">
                  <pdfaProperty:name>ConformanceLevel</pdfaProperty:name>
                  <pdfaProperty:valueType>Text</pdfaProperty:valueType>
                  <pdfaProperty:category>external</pdfaProperty:category>
                  <pdfaProperty:description>The conformance level of the Factur-X PDF</pdfaProperty:description>
                </rdf:li>
              </rdf:Seq>
            </pdfaSchema:property>
          </rdf:li>
        </rdf:Bag>
      </pdfaExtension:schemas>

      <!-- Factur-X properties -->
      <fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>
      <fx:DocumentType>INVOICE</fx:DocumentType>
      <fx:Version>1.0</fx:Version>
      <fx:ConformanceLevel>MINIMUM</fx:ConformanceLevel>

    </rdf:Description>
  </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;
}
