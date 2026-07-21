import SectionHead from "./SectionHead";
import { ProductContent } from "@/lib/content";

export default function Faq({ data }: { data: ProductContent["faq"] }) {
  if (!data?.items?.length) return null;
  return (
    <section
      id="faq"
      className="py-20 md:py-24"
      style={{ background: "linear-gradient(180deg,var(--cream) 0%,var(--cream-deep) 100%)" }}
    >
      <div className="mx-auto max-w-[820px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "الأسئلة الشائعة"} title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-4">
          {data.items.map((f, i) => (
            <details
              key={i}
              className="group rounded-[18px] border border-[rgba(200,147,46,0.15)] bg-white/75 px-6 py-4 backdrop-blur transition-all open:shadow-md"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-[17px] font-bold text-brown">
                <span>{f.q}</span>
                <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[rgba(229,167,40,0.15)] text-gold-deep transition-transform group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 leading-8 text-brown-soft">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
