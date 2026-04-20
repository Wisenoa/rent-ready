import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { articles } from "@/data/articles";
import { baseMetadata } from "@/lib/seo/metadata";

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

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    dateModified: article.updatedAt,
    author: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    publisher: {
      "@type": "Organization",
      name: "RentReady",
      url: "https://www.rentready.fr",
    },
    url: `https://www.rentready.fr/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://www.rentready.fr/blog/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

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

        {/* Article content */}
        {article.content ? (
          <div className="prose prose-stone prose-lg max-w-none
            prose-headings:text-stone-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
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
