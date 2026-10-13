import { formatEntryPrice } from "@/data/entity";
import { MonthPanel } from "./MonthPanel";
import { HERO_STATE } from "./month-script";
import { TrackedCtaLink } from "./TrackedCtaLink";

export function HomeHero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-[#1E3A2F] text-[#FAF9F5]"
    >
      {/* A ledger's ruled lines, barely there: the page's one decorative gesture. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_47px,rgba(250,249,245,0.045)_47px,rgba(250,249,245,0.045)_48px)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-10 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          <p className="text-[14px] font-medium text-[#A8C4B1]">
            Logiciel de gestion locative
          </p>
          <h1
            id="hero-title"
            className="mt-4 text-[2.75rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-[4rem] xl:text-[4.15rem]"
          >
            Vos loyers suivis.
            <span className="block text-[#A8C4B1] xl:whitespace-nowrap">Vos quittances prêtes.</span>
          </h1>
          <p className="mt-6 max-w-[34rem] text-[16px] leading-7 text-[#FAF9F5]/80 sm:text-lg sm:leading-8">
            Pour les propriétaires qui louent eux-mêmes, d&apos;un à dix
            logements. Lokna sait ce qui est dû chaque mois, montre ce qui
            manque, et prépare quittances, reçus et relances.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-7">
            <TrackedCtaLink
              href="/register"
              event={{ name: "homepage_hero_cta_click", properties: { position: "hero" } }}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FAF9F5] px-6 text-[15px] font-medium text-[#1E3A2F] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]"
            >
              Essayer gratuitement
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
                →
              </span>
            </TrackedCtaLink>
            <a
              href="#mois"
              className="self-start text-[15px] font-medium text-[#FAF9F5] underline decoration-[#7FA68E] underline-offset-[6px] transition-colors hover:decoration-[#FAF9F5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF9F5] sm:self-auto"
            >
              Voir un mois avec Lokna
            </a>
          </div>
          <p className="mt-5 text-[13.5px] text-[#FAF9F5]/65">
            14 jours d&apos;essai · sans carte bancaire · ensuite dès{" "}
            <span className="whitespace-nowrap">{formatEntryPrice()}</span>
          </p>
        </div>

        <figure className="lg:col-span-5">
          <MonthPanel state={HERO_STATE} intro />
          <figcaption className="mt-4 text-[12.5px] text-[#FAF9F5]/60">
            Le suivi du mois dans Lokna. Exemple fictif, calculé avec les règles
            du logiciel.
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
