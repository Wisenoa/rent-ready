/**
 * The editorial CTA markers, lifted out of the prose.
 *
 * 119 articles end with a line like
 *
 *   [CTA : Anticipez les impayés et gérez automatiquement vos relances avec RentReady]
 *
 * and `extractFAQ` was already using `\n\[CTA` as a boundary — the marker was
 * written as a machine token. But nothing ever consumed it at render time: the
 * content went straight into `<ReactMarkdown>`, which renders `[CTA : …]` as the
 * paragraph it plainly is. So 118 pages showed a bracket and a colon to the
 * visitor.
 *
 * Splitting it out here does two things. It removes the raw text, and it gives
 * the template a CTA with the writer's own wording instead of a generic button.
 * Mapping each article to the tool its subject deserves — IRL → the IRL
 * calculator, bail → the right template — is NOT done here and is not claimed.
 */
const CTA_MARKER = /^\[CTA\s*:\s*(.+?)\]\s*$/gm;

export interface SplitContent {
  /** The prose, with the markers removed. */
  body: string;
  /** The last marker's text, if the article had one. */
  cta?: string;
}

export function splitEditorialCTA(content: string | undefined): SplitContent {
  if (!content) return { body: "" };
  let last: string | undefined;
  const body = content.replace(CTA_MARKER, (_all, text: string) => {
    const trimmed = text.trim();
    if (trimmed) last = trimmed;
    return "";
  });
  return { body: body.replace(/\n{3,}/g, "\n\n").trimEnd(), cta: last };
}

