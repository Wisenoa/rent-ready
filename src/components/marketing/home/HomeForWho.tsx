import Image from "next/image";
import { Reveal } from "./Reveal";

const POINTS = [
  {
    title: "Pas un logiciel d'agence",
    text: "Pas de mandats ni d'outils de gestionnaire professionnel. Un logement, un locataire, un bail, et vous commencez.",
  },
  {
    title: "Les règles appliquées pour vous",
    text: "Quittance seulement au paiement complet, loyer et charges séparés, révision selon l'indice publié par l'INSEE.",
  },
  {
    title: "Rien de nouveau à apprendre",
    text: "L'écran d'accueil, c'est le mois en cours. Ce qui est réglé se fait discret ; ce qui demande une action reste en évidence.",
  },
];

export function HomeForWho() {
  return (
    <section aria-labelledby="pour-qui-title" className="bg-[#FAF9F5]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-6 lg:order-2">
          <Reveal as="figure" className="relative -mx-5 aspect-[3/2] overflow-hidden bg-[#DDD6C9] sm:mx-0 lg:aspect-[4/5]">
            <Image
              src="/images/gestion-locative/cour-porte-ouverte.webp"
              alt="La porte d'un immeuble ouverte sur une cour ensoleillée."
              fill
              sizes="(min-width: 1280px) 580px, (min-width: 1024px) 46vw, 100vw"
              className="object-cover object-[50%_45%]"
            />
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:order-1 lg:self-center">
          <h2
            id="pour-qui-title"
            className="max-w-[16ch] text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem]"
          >
            Pour ceux qui louent eux-mêmes.
          </h2>
          <p className="mt-5 max-w-[34rem] text-[17px] leading-8 text-[#4F5D56]">
            Un studio en ville, deux appartements hérités, un T3 loué depuis
            dix ans : Lokna est fait pour les propriétaires qui gèrent d&apos;un
            à dix logements, sans agence.
          </p>
          <ul className="mt-10 border-t-2 border-[#15241F]">
            {POINTS.map((point, i) => (
              <Reveal as="li" key={point.title} index={i} className="border-b border-[#D9D5CC] py-5">
                <h3 className="text-[17px] font-semibold text-[#15241F]">{point.title}</h3>
                <p className="mt-1.5 max-w-[34rem] text-[15px] leading-6 text-[#4F5D56]">{point.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
