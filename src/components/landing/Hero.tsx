import Image from "next/image";
import { ProductView } from "@/lib/funnel-types";
import { ProductContent } from "@/lib/content";

export default function Hero({
  product,
  content,
  tagline,
  heroBadge,
  rating,
  ratingCount,
  image,
}: {
  product: ProductView;
  content: ProductContent;
  tagline?: string | null;
  heroBadge?: string | null;
  rating: number;
  ratingCount: number;
  image?: string | null;
}) {
  const pills = content.trustPills ?? [
    "🚚 توصيل سريع",
    "💵 دفع عند الاستلام",
    "🌿 مكونات طبيعية",
    "🔒 طلب آمن",
  ];
  return (
    <section
      id="hero"
      className="relative overflow-hidden py-14 md:py-24"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(229,167,40,.2),transparent 60%),radial-gradient(ellipse 60% 50% at 100% 100%,rgba(200,147,46,.15),transparent 60%),linear-gradient(180deg,var(--cream) 0%,var(--cream-deep) 100%)",
      }}
    >
      <div className="absolute -left-24 -top-24 h-96 w-96 animate-floaty rounded-full bg-[radial-gradient(circle,rgba(245,215,142,.4),transparent_70%)] blur-3xl" />
      <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-10 px-5 md:grid-cols-[1.1fr_1fr] md:gap-14">
        <div className="text-center md:text-right">
          {heroBadge && (
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[rgba(200,147,46,0.3)] bg-white/70 px-4 py-2 text-[13px] font-bold text-gold-deep shadow-sm backdrop-blur">
              <span className="h-2 w-2 animate-softpulse rounded-full bg-brand-green" />
              <span>{heroBadge}</span>
            </div>
          )}
          <h1 className="mb-5 text-[clamp(34px,7vw,56px)] leading-[1.2]">
            {product.name}
          </h1>
          {tagline && (
            <p className="mx-auto mb-7 max-w-[600px] text-[clamp(17px,2.5vw,21px)] leading-[1.7] text-brown-soft md:mx-0">
              {tagline}
            </p>
          )}
          <div className="mb-7 inline-flex items-center gap-2.5 rounded-full bg-white/70 px-5 py-2.5 shadow-sm backdrop-blur">
            <span className="text-lg tracking-[2px] text-honey">★★★★★</span>
            <span className="text-sm font-bold text-brown">{rating} من 5</span>
            <span className="text-[13px] text-brown-soft">
              · {new Intl.NumberFormat("ar-IQ").format(ratingCount)} تقييم
            </span>
          </div>
          <div className="mb-8 flex flex-col items-center gap-3.5 sm:flex-row sm:justify-center md:justify-start">
            <a
              href="#order"
              className="btn-shine inline-flex min-h-[64px] w-full max-w-[340px] items-center justify-center rounded-full bg-gradient-to-br from-honey via-gold to-gold-deep px-11 py-5 font-display text-xl font-extrabold text-white shadow-[0_8px_24px_rgba(200,147,46,0.45)] transition-all hover:-translate-y-1 sm:w-auto"
            >
              اطلب الآن وادفع عند الاستلام
            </a>
            <a
              href="#benefits"
              className="inline-flex min-h-[64px] w-full max-w-[340px] items-center justify-center rounded-full border-2 border-gold bg-white px-11 py-5 font-display text-xl font-extrabold text-gold-deep shadow-sm transition-all hover:bg-gold hover:text-white sm:w-auto"
            >
              اكتشف المميزات
            </a>
          </div>
          <div className="flex flex-wrap justify-center gap-3 md:justify-start">
            {pills.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 rounded-full border border-[rgba(200,147,46,0.2)] bg-white/60 px-3.5 py-2 text-[13px] font-semibold text-brown backdrop-blur"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="relative flex justify-center">
          <div className="relative w-full max-w-[440px]">
            {image ? (
              <Image
                src={image}
                alt={product.name}
                width={480}
                height={480}
                priority
                className="w-full -rotate-2 rounded-[32px] shadow-[var(--shadow-lg)] ring-8 ring-white/50"
              />
            ) : (
              <div className="flex aspect-square w-full -rotate-2 items-center justify-center rounded-[32px] bg-gradient-to-br from-honey-light to-gold text-[120px] shadow-[var(--shadow-lg)]">
                🐝
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
