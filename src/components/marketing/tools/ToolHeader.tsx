import { Breadcrumb, type BreadcrumbItem } from "@/components/seo/Breadcrumb";

export interface ToolFact {
  label: string;
  value: string;
}

/**
 * Top of a free tool: where it sits, what it does, and the facts a landlord
 * checks before trusting a figure (data source, date, price). Server-rendered.
 */
export function ToolHeader({
  breadcrumb,
  eyebrow,
  title,
  intro,
  facts,
}: {
  breadcrumb: BreadcrumbItem[];
  eyebrow: string;
  title: string;
  intro: string;
  facts: ToolFact[];
}) {
  return (
    <header className="max-w-3xl">
      <Breadcrumb items={breadcrumb} />
      <p className="mt-6 text-[13px] font-medium uppercase tracking-[0.14em] text-sage-700">{eyebrow}</p>
      <h1 className="mt-3 text-[2.05rem] font-semibold leading-[1.08] tracking-[-0.035em] text-ink text-balance sm:text-[2.7rem]">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-[17px] leading-8 text-ink-muted text-pretty">{intro}</p>
      <dl className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-baseline gap-1.5">
            <dt className="text-ink-muted">{fact.label}</dt>
            <dd className="font-medium text-ink">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
