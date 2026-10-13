import Image from "next/image";
import { formatEntryPrice } from "@/data/entity";
import { TrackedCtaLink } from "./TrackedCtaLink";

export function HomeFinalCTA() {
  return (
    <section aria-labelledby="final-title" className="bg-[#1E3A2F] text-[#FAF9F5]">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[3/2] overflow-hidden bg-[#2A4A3D] lg:aspect-auto lg:min-h-[34rem]">
          <Image
            src="/images/gestion-locative/logement-entree.webp"
            alt="L'entrée lumineuse d'un appartement, les clés posées sur la console."
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover object-[62%_50%]"
          />
        </div>
        <div className="flex max-w-[44rem] flex-col justify-center px-5 py-16 sm:px-8 sm:py-20 lg:px-16 xl:px-20">
          <h2
            id="final-title"
            className="max-w-[14ch] text-[2.4rem] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[3.4rem]"
          >
            Commencez par un logement.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-8 text-[#FAF9F5]/80">
            Ajoutez-le avec son locataire et son bail. Dès la première échéance,
            Lokna vous dit qui a payé, ce qui manque et quel document remettre.
          </p>
          <div className="mt-9">
            <TrackedCtaLink
              href="/register"
              event={{ name: "homepage_final_cta_click", properties: { position: "final" } }}
              className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#FAF9F5] px-6 text-[15px] font-medium text-[#1E3A2F] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FAF9F5]"
            >
              Essayer gratuitement
              <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none">
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
