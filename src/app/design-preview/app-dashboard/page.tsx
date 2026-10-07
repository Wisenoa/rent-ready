import { DashboardTranslation } from "@/components/design-translation/dashboard-translation";

export const metadata = {
  title: "Tableau de Bord · Translation Test | RentReady",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ state?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isResolved = params?.state === "resolved";

  return <DashboardTranslation initialResolved={isResolved} />;
}
