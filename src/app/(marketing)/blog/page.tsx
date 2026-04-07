import type { Metadata } from "next";
export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { SchemaMarkup } from "@/components/seo/schema-markup";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Blog Immobilier — Conseils Gestion Locative et Investissement",
  description:
    "Conseils et guides pour propriétaires bailleurs: gestion locative, quittances, révision IRL, législation immobilière. Toutes les actualités de l'immobilier en France.",
  alternates: {
    canonical: "https://www.rentready.fr/blog",
  },
  openGraph: {
    title: "Blog Immobilier — Conseils Gestion Locative et Investissement",
    description:
      "Conseils et guides pour propriétaires bailleurs: gestion locative, quittances, révision IRL, législation immobilière.",
    url: "https://www.rentready.fr/blog",
    type: "website",
  },
};

const blogPosts = articles;

const categories = ["Tous", "Gestion", "Calculs", "Juridique", "Fiscalité"];

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Blog RentReady",
  description: "Conseils et guides pour propriétaires bailleurs",
  url: "https://www.rentready.fr/blog",
  publisher: {
    "@type": "Organization",
    name: "RentReady",
    url: "https://www.rentready.fr",
  },
};

export default function BlogPage() {
  return (
    <>
      <SchemaMarkup data={schema} />

      <article className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
            Blog Immobilier — Conseils Gestion Locative
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
            Guides pratiques, actualités juridiques et conseils pour propriétaires
            bailleurs. Optimisez votre gestion locative avec nos articles
            spécialisés.
          </p>
        </header>

        <nav className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              className="rounded-lg bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-200"
            >
              {category}
            </button>
          ))}
        </nav>

        <section className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="group rounded-xl border border-stone-200/60 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-center gap-3 text-xs text-stone-500">
                <span
                  className={`rounded-full px-2 py-0.5 ${
                    post.category === "Gestion"
                      ? "bg-blue-100 text-blue-700"
                      : post.category === "Juridique"
                        ? "bg-purple-100 text-purple-700"
                        : post.category === "Calculs"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {post.category}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(post.date).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {post.readTime}
                </span>
              </div>

              <h2 className="mb-2 text-lg font-semibold text-stone-900 group-hover:text-blue-700">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>

              <p className="mb-4 text-sm leading-relaxed text-stone-600">
                {post.excerpt}
              </p>

              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                Lire l'article
                <ArrowRight className="size-4" />
              </Link>
            </article>
          ))}
        </section>

        <section className="mt-16 rounded-xl border border-blue-200/60 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 text-center sm:p-10">
          <h2 className="mb-3 text-xl font-bold text-stone-900 sm:text-2xl">
            Automatisez votre gestion locative
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-stone-600">
            RentReady génère les quittances, calcule l'IRL et suit vos loyers
            automatiquement. Essai gratuit 14 jours.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Commencer l'essai gratuit
            <ArrowRight className="size-4" />
          </Link>
        </section>
      </article>
    </>
  );
}