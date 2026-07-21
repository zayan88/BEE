import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const products = await prisma.product
    .findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    })
    .catch(() => []);

  // Single-product store → go straight to the funnel.
  if (products.length === 1) redirect(`/p/${products[0].slug}`);

  return (
    <main className="mx-auto max-w-[1100px] px-5 py-16">
      <div className="mb-12 text-center">
        <span className="mb-4 inline-block rounded-full bg-[rgba(229,167,40,0.12)] px-5 py-2 font-display text-xs font-bold tracking-widest text-gold-deep">
          متجر الدفع عند الاستلام
        </span>
        <h1 className="text-[clamp(30px,6vw,48px)]">
          منتجاتنا <span className="text-gradient-gold">المميزة</span>
        </h1>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-[rgba(200,147,46,0.3)] bg-white p-12 text-center text-brown-soft">
          لا توجد منتجات منشورة بعد.{" "}
          <Link href="/admin" className="font-bold text-gold-deep underline">
            لوحة التحكم
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/p/${p.slug}`}
              className="group overflow-hidden rounded-3xl border border-[rgba(200,147,46,0.15)] bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-honey-light to-gold text-6xl">
                🐝
              </div>
              <div className="p-5">
                <h3 className="mb-1 text-lg">{p.name}</h3>
                {p.tagline && (
                  <p className="mb-3 line-clamp-2 text-sm text-brown-soft">{p.tagline}</p>
                )}
                <div className="font-display text-xl font-black text-gold-deep">
                  {formatMoney(p.price, p.currencySymbol)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
