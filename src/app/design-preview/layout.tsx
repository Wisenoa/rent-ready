import type { Metadata } from "next";

/**
 * Internal design mock-ups, reachable by URL but not meant for search results.
 *
 * Seven of these pages shipped without a robots directive and were indexable.
 * Declaring `noindex` here covers every current and future preview at once.
 *
 * Deliberately NOT disallowed in robots.ts: a crawler that may not fetch a page
 * never reads its `noindex`, so an already-discovered URL could stay indexed.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DesignPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
