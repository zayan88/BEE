import SectionHead from "./SectionHead";
import { formatNumber } from "@/lib/utils";

type ReviewItem = {
  id: string;
  author: string;
  location: string | null;
  rating: number;
  body: string;
};

export default function Reviews({
  reviews,
  rating,
  ratingCount,
}: {
  reviews: ReviewItem[];
  rating: number;
  ratingCount: number;
}) {
  if (!reviews.length) return null;
  return (
    <section id="reviews" className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead
          eyebrow="آراء العملاء"
          title="ماذا قال عملاؤنا؟"
          subtitle="تجارب حقيقية من عملاء في مختلف المحافظات."
        />
        <div className="mx-auto mb-12 flex max-w-[640px] flex-wrap items-center justify-center gap-6 rounded-[28px] border border-[rgba(200,147,46,0.15)] bg-cream/60 px-8 py-6 text-center">
          <div>
            <div className="font-display text-5xl font-black text-gold-deep">{rating}</div>
            <div className="text-lg tracking-[2px] text-honey">★★★★★</div>
          </div>
          <div className="h-12 w-px bg-[rgba(200,147,46,0.25)]" />
          <div className="text-sm font-semibold text-brown-soft">
            {formatNumber(ratingCount)} تقييم موثوق
            <br /> من عملاء سعداء
          </div>
          <div className="h-12 w-px bg-[rgba(200,147,46,0.25)]" />
          <div className="text-sm font-semibold text-brown-soft">
            98%
            <br /> يوصون به لغيرهم
          </div>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="glass flex h-full flex-col rounded-[24px] px-6 py-6"
            >
              <div className="mb-3 text-honey" aria-label={`${r.rating} من 5`}>
                {"★".repeat(r.rating)}
                <span className="text-[rgba(200,147,46,0.3)]">{"★".repeat(5 - r.rating)}</span>
              </div>
              <p className="mb-4 flex-1 leading-7 text-brown-soft">“{r.body}”</p>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-honey to-gold font-display font-black text-white">
                  {r.author.charAt(0)}
                </div>
                <div>
                  <div className="font-display text-sm font-bold text-brown">{r.author}</div>
                  {r.location && (
                    <div className="text-xs text-brown-soft">{r.location} · عميل موثّق ✓</div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
