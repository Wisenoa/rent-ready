"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** Stable references: useSyncExternalStore must never see a fresh object. */
const NO_ITEMS: TocItem[] = [];
const NO_ACTIVE_ID = "";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Stamps slug ids on the article's H2/H3 headings and returns them.
 *
 * This writes to the DOM, so it belongs in an effect body: the ids must exist
 * before the item list is read, because that list is also what the anchor
 * links and the scroll-spy match against.
 */
function collectArticleHeadings(): HTMLElement[] {
  const article = document.querySelector("article .prose");
  if (!article) return [];

  const headings = Array.from(
    article.querySelectorAll<HTMLElement>("h2, h3")
  );
  headings.forEach((h) => {
    if (!h.id) {
      h.id = slugify(h.textContent || "");
    }
  });
  return headings;
}

function toTocItems(headings: HTMLElement[]): TocItem[] {
  return headings.map((h) => ({
    id: h.id || slugify(h.textContent || ""),
    text: h.textContent || "",
    level: parseInt(h.tagName.replace("H", ""), 10),
  }));
}

function sameItems(a: TocItem[], b: TocItem[]): boolean {
  if (a.length !== b.length) return false;
  return a.every(
    (item, i) =>
      item.id === b[i].id && item.text === b[i].text && item.level === b[i].level
  );
}

/**
 * Scroll-spy values kept outside React and read with useSyncExternalStore.
 *
 * Both the heading list and the active id are measurements of an external
 * system (the article DOM and the viewport), not React state, so they are
 * published through a store: each is readable during render, so mounting costs
 * no extra pass, and every update arrives through a listener callback.
 * `setState` in the effect body is what react-hooks/set-state-in-effect
 * rejects, and it cascaded a render on every mount.
 */
function createTocStore() {
  let items: TocItem[] = NO_ITEMS;
  let activeId = NO_ACTIVE_ID;
  const listeners = new Set<() => void>();

  const emit = () => {
    listeners.forEach((listener) => listener());
  };

  return {
    getItems: () => items,
    getActiveId: () => activeId,

    subscribe(onStoreChange: () => void) {
      listeners.add(onStoreChange);
      // Prime the subscriber: the first measurement lands right after mount,
      // and reading it here keeps the update from depending on effect order.
      onStoreChange();
      return () => {
        listeners.delete(onStoreChange);
      };
    },

    refresh(headings: HTMLElement[]) {
      const next = toTocItems(headings);
      // Keep the array identity stable so unchanged re-reads don't re-render.
      if (sameItems(next, items)) return;
      items = next;
      emit();
    },

    setActiveId(next: string) {
      if (next === activeId) return;
      activeId = next;
      emit();
    },
  };
}

type TocStore = ReturnType<typeof createTocStore>;

export function TableOfContents() {
  // One store per component instance, built lazily on first render.
  const [store] = useState(createTocStore);

  // getServerSnapshot is the same read: there is no article DOM on the server
  // and the store starts empty, so SSR and the first client render agree (the
  // sidebar renders null until the headings are measured).
  const items = useSyncExternalStore(
    store.subscribe,
    store.getItems,
    store.getItems
  );
  const activeId = useSyncExternalStore(
    store.subscribe,
    store.getActiveId,
    store.getActiveId
  );

  useEffect(() => {
    // DOM side effects only: stamp the heading ids, publish the item list,
    // and subscribe the scroll-spy. Nothing here calls setState.
    const headings = collectArticleHeadings();
    store.refresh(headings);

    if (headings.length === 0) return;

    // Intersection observer for active section
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            store.setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [store]);

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
