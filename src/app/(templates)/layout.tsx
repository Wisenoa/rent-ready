import { MarketingShell } from "@/components/marketing/site/MarketingShell";

export const revalidate = 3600;

export default function TemplatesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MarketingShell>{children}</MarketingShell>;
}
