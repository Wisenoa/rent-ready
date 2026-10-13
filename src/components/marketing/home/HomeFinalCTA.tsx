import { formatEntryPrice } from "@/data/entity";
import { ParallaxPhoto } from "./ParallaxPhoto";
import { TrackedCtaLink } from "./TrackedCtaLink";
import styles from "./home.module.css";

const START = [
  "Créez votre compte avec votre e-mail, sans carte bancaire.",
  "Ajoutez un logement, son locataire et son bail.",
  "Enregistrez les loyers à leur arrivée. Lokna tient le reste du mois.",
];

export function HomeFinalCTA() {
  return (
    <section aria-labelledby="final-title" className="bg-[#1E3A2F] text-[#FAF9F5]">
      <div className="grid lg:grid-cols-2">
        <ParallaxPhoto
          src="/images/gestion-locative/logement-entree.webp"
          alt="L'entrée lumineuse d'un appartement, les clés posées sur la console."
          sizes="(min-width: 1024px) 50vw, 100vw"
          position="62% 50%"
          className="aspect-[3/2] lg:aspect-auto lg:min-h-[36rem]"
        />
        <div className="flex max-w-[44rem] flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-16 xl:px-20">
          <h2
            id="final-title"
            className="max-w-[14ch] text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]"
          >
            Commencez par un logement.
          </h2>
          <ol className="mt-7 max-w-[30rem] border-t border-[#FAF9F5]/15">
            {START.map((step, i) => (
              <li key={step} className="grid grid-cols-[2rem_1fr] border-b border-[#FAF9F5]/15 py-3.5 text-[16px] leading-7 text-[#FAF9F5]/85">
                <span className="font-[family-name:var(--font-serif)] text-[1.2rem] text-[#A8C4B1]">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-9">
            <TrackedCtaLink
              href="/register"
              event={{ name: "homepage_final_cta_click", properties: { position: "final" } }}
              className={`${styles.cta} inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FAF9F5] px-6 text-[15px] font-medium text-[#1E3A2F] hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]`}
            >
              Essayer gratuitement
              <span aria-hidden="true" className={styles.arrow}>
                →
              </span>
            </TrackedCtaLink>
          </div>
          <p className="mt-5 text-[13.5px] text-[#FAF9F5]/65">
            14 jours d&apos;essai · sans carte bancaire · ensuite dès{" "}
            <span className="whitespace-nowrap">{formatEntryPrice()}</span>
          </p>
        </div>
      </div>
    </section>
  );
}
