import Link from "next/link";
import { PLANS } from "@/data/entity";
import { cn } from "@/lib/utils";
import { TrackedCtaLink } from "./TrackedCtaLink";

/** Published prices and limits only; the detail of each plan lives on /pricing. */
const PRICED = PLANS.flatMap((plan) =>
  (plan.id === "starter" || plan.id === "pro") &&
  plan.monthlyPrice !== null &&
  plan.properties !== null
    ? [{ ...plan, id: plan.id, monthlyPrice: plan.monthlyPrice, properties: plan.properties }]
    : []
);

export function HomePricing() {
  return (
    <section id="tarifs" aria-labelledby="tarifs-title" className="scroll-mt-14 bg-[#F5F3EF]">
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-28">
        <div className="grid gap-5 border-t-2 border-[#15241F] pt-8 lg:grid-cols-12 lg:gap-10">
          <h2
            id="tarifs-title"
            className="text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem] lg:col-span-6"
          >
            Un prix selon le nombre de logements.
          </h2>
          <p className="max-w-[34rem] text-[17px] leading-8 text-[#4F5D56] lg:col-span-5 lg:col-start-8 lg:pt-3">
            Chaque formule commence par 14 jours d&apos;essai, sans carte
            bancaire. Vous choisissez ensuite, au mois ou à l&apos;année.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {PRICED.map((plan) => {
            const pro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-xl border p-7 sm:p-9",
                  pro
                    ? "border-[#1E3A2F] bg-[#1E3A2F] text-[#FAF9F5]"
                    : "border-[#D9D5CC] bg-[#FDFCF9] text-[#15241F]"
                )}
              >
                <h3 className="text-[1.4rem] font-semibold tracking-[-0.02em]">{plan.name}</h3>
                <p className={cn("mt-1 text-[15px]", pro ? "text-[#FAF9F5]/75" : "text-[#4F5D56]")}>
                  Jusqu&apos;à {plan.properties} logements
                </p>
                <p className="mt-8 flex items-baseline gap-1.5">
                  <span className="text-[3.25rem] font-semibold leading-none tracking-[-0.04em] tabular-nums">
                    {plan.monthlyPrice}&nbsp;€
                  </span>
                  <span className={pro ? "text-[#FAF9F5]/70" : "text-[#5C6560]"}>/mois</span>
                </p>
                {plan.annualPrice !== null ? (
                  <p className={cn("mt-2 text-[14px] tabular-nums", pro ? "text-[#FAF9F5]/70" : "text-[#5C6560]")}>
                    ou {plan.annualPrice}&nbsp;€ par an
                  </p>
                ) : null}
                <TrackedCtaLink
                  href="/register"
                  event={{ name: "homepage_pricing_click", properties: { plan: plan.id, billing: "monthly" } }}
                  className={cn(
                    "mt-9 inline-flex min-h-12 items-center justify-center rounded-md px-6 text-[15px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2",
                    pro
                      ? "bg-[#FAF9F5] text-[#1E3A2F] hover:bg-white focus-visible:outline-[#FAF9F5]"
                      : "bg-[#1E3A2F] text-[#FAF9F5] hover:bg-[#15241F] focus-visible:outline-[#1E3A2F]"
                  )}
                >
                  Essayer {plan.name} gratuitement
                </TrackedCtaLink>
              </div>
            );
          })}
        </div>
        <p className="mt-6 text-[15px]">
          <Link
            href="/pricing"
            className="font-medium text-[#0B3B2C] underline decoration-[#9DB3A3] underline-offset-[5px] hover:decoration-[#0B3B2C] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3B2C]"
          >
            Comparer les formules en détail
          </Link>
        </p>
      </div>
    </section>
  );
}
