"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

function extractTocFromArticle(): TocItem[] {
  const article = document.querySelector("article .prose");
  if (!article) return [];

  const headings = Array.from(article.querySelectorAll("h2, h3"));
  return headings.map((h) => ({
    id: h.id || slugify(h.textContent || ""),
    text: h.textContent || "",
    level: parseInt(h.tagName.replace("H", ""), 10),
  }));
}

export function TableOfContents() {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Add IDs to headings in the article
    const article = document.querySelector("article .prose");
    if (article) {
      const headings = Array.from(article.querySelectorAll("h2, h3"));
      headings.forEach((h) => {
        if (!h.id) {
          h.id = slugify(h.textContent || "");
        }
      });
    }

    const tocItems = extractTocFromArticle();
    setItems(tocItems);

    if (tocItems.length === 0) return;

    // Intersection observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  if (items.length < 3) return null;

  return (
    <aside className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-stone-400">
          Sommaire
        </p>
        <nav aria-label="Table des matières">
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`
                    block text-sm leading-snug transition-colors
                    ${item.level === 3 ? "pl-4" : ""}
                    ${
                      activeId === item.id
                        ? "font-medium text-blue-600"
                        : "text-stone-500 hover:text-stone-800"
                    }
                  `}
                >
                  {activeId === item.id && (
                    <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-middle" />
                  )}
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
