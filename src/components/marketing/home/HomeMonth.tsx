import { Fragment } from "react";
import { MONTH_STATES, MONTH_STEPS } from "./month-script";
import { MonthStory } from "./MonthStory";

export function HomeMonth() {
  return (
    <section id="mois" aria-labelledby="mois-title" className="scroll-mt-14 bg-[#F5F3EF]">
      <div className="mx-auto max-w-7xl px-5 pt-4 sm:px-8 sm:pt-6">
        <div className="grid gap-4 border-t-2 border-[#15241F] pt-8 lg:grid-cols-12 lg:gap-10">
          <h2
            id="mois-title"
            className="text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem] lg:col-span-6"
          >
            Un mois avec Lokna.
          </h2>
          <p className="max-w-[34rem] text-[16px] leading-7 text-[#4F5D56] sm:text-[17px] sm:leading-8 lg:col-span-5 lg:col-start-8 lg:pt-3">
            Trois logements, trois loyers, un versement qui n&apos;arrive pas
            entier. Faites défiler octobre : le suivi et les documents changent
            comme dans le logiciel.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-24 lg:pt-12">
        <MonthStory
          states={MONTH_STATES}
          dates={MONTH_STEPS.map((step) => step.date)}
          steps={MONTH_STEPS.map((step) => (
            <Fragment key={step.date}>
              <p className="font-[family-name:var(--font-serif)] text-[1.9rem] leading-none tracking-[-0.02em] sm:text-[2.3rem]">
                {step.date}
              </p>
              <h3 className="mt-2.5 text-[1.2rem] font-semibold tracking-[-0.02em] sm:text-[1.35rem]">{step.title}</h3>
              <p className="mt-1.5 max-w-[30rem] text-[15px] leading-6 sm:text-[16px] sm:leading-7">{step.text}</p>
            </Fragment>
          ))}
        />
      </div>
    </section>
  );
}
