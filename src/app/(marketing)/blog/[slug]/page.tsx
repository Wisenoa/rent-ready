import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { articles } from "@/data/articles";
import { baseMetadata } from "@/lib/seo/metadata";
import glossaryData from "@/data/glossary.json";

/** Extract Q&A pairs from a FAQ section in article markdown */
function extractFAQ(content: string): { question: string; answer: string }[] {
  const faqSection = content.match(/## FAQ —[\s\S]+?(?=\n## [^F]|\n\n\/\\*\\*|\n\[CTA)/);
  if (!faqSection) return [];

  const section = faqSection[0];
  const qaPairs: { question: string; answer: string }[] = [];

  // Match **bold** question OR ### h3 question, followed by answer paragraphs
  const matches = section.matchAll(
    /(?:^###\s+(.+?)\n\n|(?:^)\*\*([^*]+)\*\*\n\n)([\s\S]+?)(?=^###\s|\n\*\*|\n\[CTA]|$)/gm
  );
  for (const match of matches) {
    const question = (match[1] || match[2]).trim();
    const answer = match[3].replace(/\n\n+/g, " ").trim();
    if (question && answer) {
      qaPairs.push({ question, answer });
    }
  }
  return qaPairs;
}

/** Slugs of glossary terms that appear in each blog article */
const ARTICLE_GLOSSARY_MAP: Record<string, string[]> = {
  "comment-gerer-loyers-impayes": ["quittance-loyer", "loyer-nu", "charges-recuperables", "impaye-loyer", "relance-loyer", "garant-loyer", "depot-garantie"],
  "revision-loyer-irl-guide-complet": ["irl-indice-reference-loyers", "loyer-nu", "revision-loyer", "encadrement-loyer"],
  "depot-garantie-regles-essentielles": ["depot-garantie", "bail-location", "etat-des-lieux", "charges-recuperables", "quittance-loyer"],
  "etat-des-lieux-entree-sortie": ["etat-des-lieux", "bail-location", "depot-garantie", "quittance-loyer"],
  "loi-alur-proprietaire-bailleur": ["bail-location", "loyer-nu", "encadrement-loyer", "charges-recuperables", "etat-des-lieux", "preavis-loyer"],
  "optimiser-fiscalite-loyers": ["loyer-nu", "rendement-locatif", "taxe-fonciere", "location-meuble", "declaration-impot", "preavis-loyer"],
  "quittance-loyer-pdf-gratuit": ["quittance-loyer", "bail-location", "charges-recuperables", "loyer-nu"],
  "lettre-relance-loyer-impaye-modele": ["relance-loyer", "impaye-loyer", "quittance-loyer"],
  "charges-locatives-decompte-annualise": ["charges-recuperables", "loyer-ccai", "quittance-loyer", "bail-location"],
  "assurance-loyer-impaye-gli": ["impaye-loyer", "garant-loyer", "caution-locative", "depot-garantie"],
  "quittance-loyer-mentions-obligatoires": ["quittance-loyer", "bail-location", "charges-recuperables", "loyer-nu"],
  "calculer-rendement-locatif-brut-net": ["rendement-locatif", "loyer-nu", "taxe-fonciere", "vacance-locative"],
  "etat-des-lieux-proprietaire-modele": ["etat-des-lieux", "bail-location", "depot-garantie", "quittance-loyer"],
  "bail-colocation-modele-clauses": ["colocation", "bail-location", "charges-recuperables", "depot-garantie"],
  "bail-location-vide-2026": ["bail-location", "loyer-nu", "etat-des-lieux", "depot-garantie", "charges-recuperables", "preavis-loyer", "encadrement-loyer"],
  "bail-location-meuble-2026": ["location-meuble", "bail-location", "loyer-nu", "bail-mobilite", "depot-garantie"],
  "garant-caution-solidaire": ["garant-loyer", "caution-locative", "depot-garantie", "visale"],
  "notice-conge-locataire": ["conge-location", "preavis-loyer", "bail-location"],
  "preavis-depart-locataire": ["preavis-loyer", "conge-location", "bail-location", "loyer-nu"],
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article non trouvé" };

  return baseMetadata({
    title: `${article.title} | Blog RentReady`,
    description: article.excerpt,
    url: `/blog/${slug}`,
    ogType: "article",
  });
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedArticles = articles
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  // Extract h2/h3 headings from content for "In This Article" sidebar
  const tocItems: { id: string; text: string; level: number }[] = [];
  if (article.content) {
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = headingRegex.exec(article.content)) !== null) {
      const text = match[2].replace(/\*\*/g, "");
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      tocItems.push({ id, text, level: match[1].length });
    }
  }

  // Glossary terms for this article
  const glossaryTerms = (ARTICLE_GLOSSARY_MAP[slug] ?? [])
    .map((gSlug) => glossaryData.find((g) => g.slug === gSlug))
    .filter(Boolean)
    .slice(0, 6) as (typeof glossaryData)[number][];

  // Extract FAQ Q&A pairs from article content
  const faqPairs = article.content ? extractFAQ(article.content) : [];

  const articleAuthor = article.author ?? "RentReady";

  // BreadcrumbList schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: "https://www.rentready.fr",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: "https://www.rentready.fr/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: article.category,
        item: `https://www.rentready.fr/blog?category=${encodeURIComponent(article.category)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: article.title,
        item: `https://www.rentready.fr/blog/${slug}`,
      },
    ],
  };

  // Article schema with enhanced author (Organization with sameAs)
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: articleAuthor,
      url: "https://www.rentready.fr",
      sameAs: [
        "https://www.linkedin.com/company/rentready",
        "https://twitter.com/rentready_fr",
        "https://www.facebook.com/rentready.fr",
      ],
    },
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
      sameAs: [
        "https://www.linkedin.com/company/rentready",
        "https://twitter.com/rentready_fr",
        "https://www.facebook.com/rentready.fr",
      ],
    },
    url: `https://www.rentready.fr/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rentready.fr/blog/${slug}`,
    },
  };

  // FAQPage schema — only included when article has FAQ content
  const faqSchema = faqPairs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqPairs.map((qa) => ({
      "@type": "Question",
      name: qa.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: qa.answer,
      },
    })),
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm text-stone-500">
          <Link href="/" className="hover:text-stone-700">Accueil</Link>
          <span className="mx-2">›</span>
          <Link href="/blog" className="hover:text-stone-700">Blog</Link>
          <span className="mx-2">›</span>
          <span className="text-stone-700">{article.title}</span>
        </nav>

        {/* Back link */}
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour au blog
        </Link>

        {/* Article header */}
        <header className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
            {article.category}
          </div>
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl leading-tight">
            {article.title}
          </h1>
          <p className="mb-6 text-xl text-stone-600 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-stone-500">
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(article.date).toLocaleDateString("fr-FR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readTime}
            </span>
          </div>
        </header>

        {/* Two-column layout: content + sidebar */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Article content */}
          <div className="flex-1 min-w-0">
            {/* Article content */}
            {article.content ? (
              <div className="prose prose-stone prose-lg max-w-none
                prose-headings:text-stone-900 prose-headings:font-bold
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:scroll-mt-24
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:scroll-mt-24
                prose-p:text-stone-700 prose-p:leading-relaxed
                prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-700
                prose-ul:text-stone-700 prose-li:marker:text-stone-400
                prose-strong:text-stone-900
                prose-blockquote:border-l-blue-500 prose-blockquote:text-stone-600
                prose-code:text-blue-700 prose-code:bg-stone-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                prose-pre:bg-stone-900 prose-pre:text-stone-100
              ">
                <ReactMarkdown>{article.content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-stone-500">Contenu en cours de rédaction.</p>
            )}

            {/* Glossary terms section */}
            {glossaryTerms.length > 0 && (
              <div className="mt-12 rounded-xl border border-blue-100 bg-blue-50 p-6">
                <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-blue-900">
                  <BookOpen className="size-5 text-blue-600" />
                  Termes du glossaire utilisés dans cet article
                </h3>
                <div className="flex flex-wrap gap-2">
                  {glossaryTerms.map((term) => (
                    <Link
                      key={term.slug}
                      href={`/glossaire-immobilier/${term.slug}`}
                      className="rounded-lg border border-blue-200 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:border-blue-400 hover:bg-blue-100"
                    >
                      {term.term}
                    </Link>
                  ))}
                </div>
                <p className="mt-3 text-xs text-blue-700">
                  <Link href="/glossaire-immobilier" className="underline hover:text-blue-900">
                    Voir le glossaire complet
                  </Link>
                  {" "}— définitions des termes immobiliers
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: In This Article */}
          <aside className="lg:w-56 lg:shrink-0">
            {tocItems.length > 0 && (
              <div className="sticky top-8 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-stone-500">
                  Dans cet article
                </h3>
                <nav className="space-y-1">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className={`block text-sm text-stone-600 hover:text-blue-600 transition-colors ${
                        item.level === 3 ? "pl-4 text-xs" : ""
                      }`}
                    >
                      {item.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}
          </aside>
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-2xl bg-stone-900 px-8 py-10 text-center">
          <h3 className="mb-3 text-xl font-bold text-white">
            Gérez votre location efficacement avec RentReady
          </h3>
          <p className="mb-6 text-stone-400">
            Logiciel tout-en-un pour propriétaires — essai gratuit 30 jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-500 transition-colors"
          >
            Créer un compte gratuit
          </Link>
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 border-t border-stone-200 pt-12">
            <h2 className="mb-8 text-2xl font-bold text-stone-900">
              Articles similaires
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group rounded-xl border border-stone-200 p-5 hover:border-stone-300 hover:shadow-md transition-all"
                >
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-600">
                    {related.category}
                  </div>
                  <h3 className="mb-2 font-semibold text-stone-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-sm text-stone-500 line-clamp-2">
                    {related.excerpt}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-stone-400">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(related.date).toLocaleDateString("fr-FR", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span>{related.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}
