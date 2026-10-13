import { MONTH_STATES, MONTH_STEPS } from "./month-script";
import { MonthStory } from "./MonthStory";

export function HomeMonth() {
  return (
    <section id="mois" aria-labelledby="mois-title" className="scroll-mt-14 bg-[#F5F3EF]">
      <div className="mx-auto max-w-7xl px-5 pt-4 sm:px-8 sm:pt-6">
        <div className="grid gap-5 border-t-2 border-[#15241F] pt-8 lg:grid-cols-12 lg:gap-10">
          <h2
            id="mois-title"
            className="text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem] lg:col-span-6"
          >
            Un mois avec Lokna.
          </h2>
          <p className="max-w-[34rem] text-[17px] leading-8 text-[#4F5D56] lg:col-span-5 lg:col-start-8 lg:pt-3">
            Trois logements, trois loyers, un versement qui n&apos;arrive pas
            entier. Faites défiler octobre : le suivi change à chaque étape,
            exactement comme dans le logiciel.
          </p>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 sm:pb-28 lg:pt-6">
        <MonthStory steps={MONTH_STEPS} states={MONTH_STATES} />
      </div>
    </section>
  );
}
