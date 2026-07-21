import SectionHead from "./SectionHead";
import Reveal from "./Reveal";
import { ProductContent } from "@/lib/content";

export function ProblemSection({ data }: { data: ProductContent["problem"] }) {
  if (!data) return null;
  return (
    <section
      id="problem"
      className="relative py-20 md:py-24"
      style={{ background: "linear-gradient(180deg,var(--cream-deep) 0%,var(--cream) 100%)" }}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "المشكلة"} title={data.title} subtitle={data.subtitle} />
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-14">
          <div>
            {data.quote && (
              <blockquote className="mb-6 rounded-[18px] border-r-4 border-gold bg-white/70 px-7 py-6 text-lg italic text-brown-soft backdrop-blur">
                {data.quote}
              </blockquote>
            )}
            {data.paragraph && <p className="mb-6 text-brown-soft">{data.paragraph}</p>}
            <ul className="mt-6 grid gap-3.5">
              {(data.items ?? []).map((it, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-[18px] bg-white/70 px-5 py-4 font-medium transition-all hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[10px] bg-[rgba(197,69,59,0.1)] text-lg text-brand-red">
                    {it.icon}
                  </span>
                  <span>{it.text}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {(data.cards ?? []).map((c, i) => (
              <Reveal key={i} delay={i * 80}>
                <div className="rounded-[18px] border border-[rgba(200,147,46,0.15)] bg-white/75 px-4 py-6 text-center backdrop-blur transition-all hover:-translate-y-1.5 hover:shadow-md">
                  <div className="mb-2 text-4xl">{c.emoji}</div>
                  <div className="text-[15px] font-bold text-brown">{c.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function SolutionSection({ data }: { data: ProductContent["solution"] }) {
  if (!data) return null;
  return (
    <section id="solution" className="relative overflow-hidden bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "الحل"} title={data.title} subtitle={data.subtitle} />
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div className="flex justify-center">
            <div className="flex aspect-square w-full max-w-[380px] rotate-2 items-center justify-center rounded-[28px] bg-gradient-to-br from-honey-light to-gold text-[90px] shadow-[var(--shadow-lg)]">
              🌿
            </div>
          </div>
          <div>
            {data.heading && <h3 className="mb-3.5 text-2xl">{data.heading}</h3>}
            {data.paragraph && <p className="mb-5 text-brown-soft">{data.paragraph}</p>}
            <div className="grid gap-4">
              {(data.features ?? []).map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3.5 rounded-[18px] border border-[rgba(200,147,46,0.15)] bg-white/60 px-5 py-4 backdrop-blur transition-all hover:bg-white hover:shadow-sm"
                >
                  <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-[#3a6147] text-base font-bold text-white">
                    ✓
                  </span>
                  <span className="font-semibold text-brown">
                    <strong className="block font-display text-gold-deep">{f.title}</strong>
                    {f.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BenefitsSection({ data }: { data: ProductContent["benefits"] }) {
  if (!data) return null;
  return (
    <section
      id="benefits"
      className="py-20 md:py-24"
      style={{ background: "linear-gradient(180deg,var(--cream) 0%,var(--cream-deep) 100%)" }}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "المميزات"} title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(280px,1fr))]">
          {(data.items ?? []).map((b, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="glass group h-full rounded-[28px] px-7 py-9 text-center transition-all hover:-translate-y-2 hover:shadow-[var(--shadow-lg)]">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-[24px] bg-gradient-to-br from-[rgba(245,215,142,0.5)] to-[rgba(229,167,40,0.25)] text-4xl transition-transform group-hover:scale-110">
                  {b.icon}
                </div>
                <h3 className="mb-3 text-xl">{b.title}</h3>
                <p className="text-[15px] leading-7 text-brown-soft">{b.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function IngredientsSection({ data }: { data: ProductContent["ingredients"] }) {
  if (!data) return null;
  return (
    <section id="ingredients" className="relative bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "المكونات"} title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(200px,1fr))]">
          {(data.items ?? []).map((ing, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="glass group h-full rounded-[28px] px-6 py-8 text-center transition-all hover:-translate-y-2.5 hover:shadow-[var(--shadow-gold)]">
                <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-honey-light to-honey text-4xl shadow-[0_10px_30px_rgba(200,147,46,0.3)] transition-transform group-hover:rotate-6">
                  {ing.emoji}
                </div>
                <div className="mb-1 font-display text-xl font-black text-brown">{ing.name}</div>
                {ing.en && (
                  <div className="mb-3.5 text-xs font-semibold uppercase tracking-wider text-gold-deep">
                    {ing.en}
                  </div>
                )}
                <p className="text-sm leading-7 text-brown-soft">{ing.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StepsSection({ data }: { data: ProductContent["steps"] }) {
  if (!data) return null;
  return (
    <section
      id="howto"
      className="py-20 md:py-24"
      style={{ background: "linear-gradient(180deg,var(--cream-deep) 0%,var(--cream) 100%)" }}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead eyebrow={data.eyebrow ?? "طريقة الاستخدام"} title={data.title} subtitle={data.subtitle} />
        <div className="mx-auto grid max-w-[800px] gap-6 sm:grid-cols-2">
          {(data.items ?? []).map((s, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="flex items-start gap-5 rounded-[28px] border border-[rgba(200,147,46,0.15)] bg-white/75 px-7 py-6 shadow-sm backdrop-blur transition-all hover:bg-white hover:shadow-md">
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-honey to-gold-deep font-display text-2xl font-black text-white shadow-[0_8px_20px_rgba(200,147,46,0.4)]">
                  {i + 1}
                </div>
                <div>
                  <h3 className="mb-1.5 text-lg">{s.title}</h3>
                  <p className="text-[15px] leading-7 text-brown-soft">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyUsSection({ data }: { data: ProductContent["whyus"] }) {
  if (!data) return null;
  return (
    <section id="whyus" className="relative overflow-hidden bg-brown py-20 text-white md:py-24">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at top right,rgba(229,167,40,.2),transparent 50%),radial-gradient(ellipse at bottom left,rgba(229,167,40,.15),transparent 50%)",
        }}
      />
      <div className="relative z-10 mx-auto max-w-[1200px] px-5">
        <SectionHead light eyebrow={data.eyebrow ?? "لماذا نحن"} title={data.title} subtitle={data.subtitle} />
        <div className="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(220px,1fr))]">
          {(data.items ?? []).map((c, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="h-full rounded-[28px] border border-white/10 bg-white/[0.06] px-6 py-8 text-center backdrop-blur-xl transition-all hover:-translate-y-1.5 hover:border-honey hover:bg-white/10">
                <div className="mx-auto mb-4 flex h-18 w-18 items-center justify-center rounded-full border border-[rgba(229,167,40,0.4)] bg-gradient-to-br from-[rgba(229,167,40,0.25)] to-[rgba(200,147,46,0.15)] text-3xl">
                  {c.icon}
                </div>
                <h3 className="mb-2 text-lg text-white">{c.title}</h3>
                <p className="text-sm leading-7 text-white/70">{c.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
