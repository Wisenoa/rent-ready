import { HomebaseTranslation } from "@/components/design-translation/homebase-translation";

export const metadata = {
  title: "Property Home Base · Translation Test | RentReady",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ property?: string; state?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isResolved = params?.state === "resolved";
  const property = params?.property === "paris" ? "paris" : "nantes";

  return <HomebaseTranslation initialProperty={property} initialResolved={isResolved} />;
}
