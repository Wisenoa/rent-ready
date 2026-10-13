import { ParallaxPhoto } from "./ParallaxPhoto";
import { Reveal } from "./Reveal";

const ROWS = [
  {
    before: "Ouvrir la banque et cocher les virements, ligne par ligne, dans le tableur.",
    after: "Les loyers attendus sont déjà là. Vous enregistrez ce qui arrive.",
  },
  {
    before: "Calculer ce qu'il manque quand un locataire paie en deux fois.",
    after: "Le reste dû se recalcule à chaque versement.",
  },
  {
    before: "Reprendre le modèle de quittance et changer le mois, le montant, le nom.",
    after: "La quittance est générée au solde, le reçu partiel avant.",
  },
  {
    before: "Retrouver la date anniversaire du bail et le bon indice de l'INSEE.",
    after: "La révision du loyer est calculée. Vous la validez.",
  },
];

export function HomeShift() {
  return (
    <section aria-labelledby="shift-title" className="bg-[#F5F3EF]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 pb-14 pt-14 sm:px-8 sm:pb-24 sm:pt-28 lg:grid-cols-12 lg:gap-14">
        {/* On phones the page goes straight to the comparison: the product comes sooner. */}
        <ParallaxPhoto
          src="/images/gestion-locative/cles-et-dossier.webp"
          alt="Des clés et un dossier de location posés sur un bureau."
          sizes="(min-width: 1280px) 480px, 38vw"
          position="40% 60%"
          className="hidden aspect-[4/5] lg:col-span-5 lg:block lg:self-start"
        />

        <div className="lg:col-span-7">
          <h2
            id="shift-title"
            className="max-w-[18ch] text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem]"
          >
            Ce que vous refaites chaque mois, Lokna le tient à jour.
          </h2>
          <p className="mt-5 max-w-[36rem] text-[17px] leading-8 text-[#4F5D56]">
            Un tableur fait exactement ce qu&apos;on lui demande. Le problème,
            c&apos;est tout ce qu&apos;il faut penser à lui demander.
          </p>

          <div className="mt-10 border-t-2 border-[#15241F]">
            <div aria-hidden="true" className="hidden grid-cols-2 gap-10 py-3 text-[13px] font-medium text-[#4F5D56] sm:grid">
              <span>Sans Lokna</span>
              <span>Avec Lokna</span>
            </div>
            <ol>
              {ROWS.map((row, i) => (
                <Reveal
                  as="li"
                  key={row.after}
                  index={i}
                  className="grid gap-2 border-t border-[#D9D5CC] py-5 sm:grid-cols-2 sm:gap-10"
                >
                  <p className="text-[15px] leading-6 text-[#5C6560]">
                    <span className="mb-1 block text-[12px] font-medium text-[#4F5D56] sm:hidden">
                      Sans Lokna
                    </span>
                    {row.before}
                  </p>
                  <p className="text-[15px] font-medium leading-6 text-[#15241F]">
                    <span className="mb-1 block text-[12px] font-medium text-[#2F6B4F] sm:hidden">
                      Avec Lokna
                    </span>
                    {row.after}
                  </p>
                </Reveal>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
