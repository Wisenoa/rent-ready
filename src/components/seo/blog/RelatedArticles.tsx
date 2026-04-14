import Link from "next/link";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { articles } from "@/data/articles";

interface RelatedArticlesProps {
  currentSlug: string;
  category?: string;
}

export function RelatedArticles({ currentSlug, category }: RelatedArticlesProps) {
  // Get articles from the same category, excluding current
  const related = articles
    .filter((a) => a.slug !== currentSlug && a.category === category)
    .slice(0, 3);

  // If not enough from same category, fill with other articles
  const others = articles
    .filter((a) => a.slug !== currentSlug && !related.find((r) => r.slug === a.slug))
    .slice(0, 3 - related.length);

  const display = [...related, ...others].slice(0, 3);

  if (display.length === 0) return null;

  const categoryColors: Record<string, string> = {
    Gestion: "bg-blue-100 text-blue-700",
    Juridique: "bg-purple-100 text-purple-700",
    Calculs: "bg-green-100 text-green-700",
    Fiscalité: "bg-amber-100 text-amber-700",
  };

  return (
    <section className="mt-16">
      <h2 className="mb-6 text-xl font-bold text-stone-900">
        Articles connexes
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {display.map((article) => (
          <Link
            key={article.slug}
            href={`/blog/${article.slug}`}
            className="group block rounded-xl border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-3 flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  categoryColors[article.category] ?? "bg-gray-100 text-gray-700"
                }`}
              >
                {article.category}
              </span>
            </div>
            <h3 className="mb-2 font-semibold text-stone-800 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm leading-snug">
              {article.title}
            </h3>
            <div className="flex items-center gap-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {new Date(article.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {article.readTime}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          Voir tous les articles
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </section>
  );
}
