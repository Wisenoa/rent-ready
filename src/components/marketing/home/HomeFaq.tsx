import { HOME_FAQ_ITEMS } from "./faq-data";

/** Native disclosure: no client JavaScript, answers stay in the HTML for search engines. */
export function HomeFaq() {
  return (
    <section aria-labelledby="faq-title" className="bg-[#F5F3EF]">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 pb-20 sm:px-8 sm:pb-28 lg:grid-cols-12">
        <h2
          id="faq-title"
          className="text-[2.1rem] font-semibold leading-[1.05] tracking-[-0.035em] text-[#15241F] sm:text-[3rem] lg:col-span-5"
        >
          Questions fréquentes
        </h2>
        <div className="border-t-2 border-[#15241F] lg:col-span-7">
          {HOME_FAQ_ITEMS.map((item) => (
            <details key={item.question} className="group border-b border-[#D9D5CC]">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-[17px] font-semibold text-[#15241F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1E3A2F] [&::-webkit-details-marker]:hidden">
                <h3>{item.question}</h3>
                <span
                  aria-hidden="true"
                  className="relative size-3 shrink-0 before:absolute before:left-0 before:top-1/2 before:h-px before:w-3 before:bg-[#1E3A2F] after:absolute after:left-1/2 after:top-0 after:h-3 after:w-px after:bg-[#1E3A2F] after:transition-transform group-open:after:scale-y-0 motion-reduce:after:transition-none"
                />
              </summary>
              <p className="max-w-[62ch] pb-6 text-[15px] leading-7 text-[#4F5D56]">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
