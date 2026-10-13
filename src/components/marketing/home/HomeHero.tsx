import { formatEntryPrice } from "@/data/entity";
import { cn } from "@/lib/utils";
import { HeroDemo } from "./HeroDemo";
import { HERO_SEQUENCE } from "./month-script";
import { TrackedCtaLink } from "./TrackedCtaLink";
import styles from "./home.module.css";

export function HomeHero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[#1E3A2F] text-[#FAF9F5]">
      {/* A ledger's ruled lines, barely there: the page's one decorative gesture. */}
      <div
        aria-hidden="true"
        className={cn(
          styles.ruled,
          "pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0,transparent_47px,rgba(250,249,245,0.045)_47px,rgba(250,249,245,0.045)_48px)]"
        )}
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 pb-12 pt-8 sm:px-8 sm:pb-24 sm:pt-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:pb-28 lg:pt-24">
        <div className="lg:col-span-7">
          <h1 id="hero-title" className={styles.title}>
            <span className="block text-[14px] font-medium tracking-normal text-[#A8C4B1]">
              Gestion locative en ligne pour propriétaires particuliers
            </span>
            {/* One block on purpose: the statement is the page's largest text,
                so it — not a late banner — is what LCP measures. */}
            <span className={cn(styles.line, "mt-4 block text-[2.8rem] font-semibold leading-[1] tracking-[-0.045em] sm:text-[4rem] xl:text-[4.15rem]")}>
              Vos loyers suivis.
              <br />
              <span className="text-[#A8C4B1] xl:whitespace-nowrap">
                Vos quittances <span className={styles.settle}>prêtes.</span>
              </span>
            </span>
          </h1>
          <p className="mt-5 max-w-[34rem] text-[16px] leading-7 text-[#FAF9F5]/80 sm:mt-6 sm:text-lg sm:leading-8">
            D&apos;un à dix logements, Lokna sait ce qui est dû chaque mois,
            montre ce qui manque et prépare quittances, reçus et relances. Sans
            tableur à tenir.
          </p>
          <div className="mt-7 flex flex-col gap-4 sm:mt-9 sm:flex-row sm:items-center sm:gap-7">
            <TrackedCtaLink
              href="/register"
              event={{ name: "homepage_hero_cta_click", properties: { position: "hero" } }}
              className={cn(
                styles.cta,
                "group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FAF9F5] px-6 text-[15px] font-medium text-[#1E3A2F] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]"
              )}
            >
              Essayer gratuitement
              <span aria-hidden="true" className={styles.arrow}>
                →
              </span>
            </TrackedCtaLink>
            <a
              href="#mois"
              className={cn(
                styles.link,
                "hidden self-start text-[15px] font-medium text-[#FAF9F5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FAF9F5] sm:inline-block sm:self-auto"
              )}
            >
              Voir un mois avec Lokna
            </a>
          </div>
          <p className="mt-4 text-[13.5px] text-[#FAF9F5]/65 sm:mt-5">
            14 jours d&apos;essai · sans carte bancaire · ensuite dès{" "}
            <span className="whitespace-nowrap">{formatEntryPrice()}</span>
          </p>
        </div>

        <figure className={cn(styles.tilt, "lg:col-span-5")}>
          <HeroDemo states={HERO_SEQUENCE} resting={3} />
        </figure>
      </div>
    </section>
  );
}
