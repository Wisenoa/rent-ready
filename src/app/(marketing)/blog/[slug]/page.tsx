import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  return <div>Slug: {slug}</div>;
}
