import { ToolRelated } from "@/components/marketing/site/ToolRelated";

/** Every tool page ends with its related resources and the way back to /outils. */
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolRelated />
    </>
  );
}
