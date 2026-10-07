import { DirectionBPlus } from "@/components/landing/directions/direction-b-plus";

export const metadata = {
  title: "Direction B+ V2 · Editorial Software | RentReady Design Preview",
  robots: { index: false, follow: false },
};

export default async function Page({
  searchParams,
}: {
  searchParams?: Promise<{ state?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const isResolved = params?.state === "resolved";

  return <DirectionBPlus initialResolved={isResolved} />;
}
