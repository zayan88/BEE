import { notFound, redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { UpsellView } from "@/lib/funnel-types";
import UpsellOffer from "@/components/landing/UpsellOffer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "عرض خاص", robots: { index: false } };

export default async function UpsellPage(props: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { orderBy: { id: "asc" } } },
  });
  if (!order) notFound();

  const productId = order.items[0]?.productId;
  if (!productId) redirect(`/thank-you/${orderId}`);

  const upsell = await prisma.upsell.findFirst({
    where: { productId, active: true },
    orderBy: { position: "asc" },
  });
  if (!upsell) redirect(`/thank-you/${orderId}`);

  const product = await prisma.product.findUnique({ where: { id: productId } });

  const view: UpsellView = {
    id: upsell.id,
    title: upsell.title,
    description: upsell.description,
    price: upsell.price,
    compareAt: upsell.compareAt,
    extraQuantity: upsell.extraQuantity,
    discountPercent: upsell.discountPercent,
    freeShipping: upsell.freeShipping,
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-[#3a6147] text-3xl text-white shadow-lg">
            ✓
          </div>
          <h2 className="text-xl text-brand-green">تم استلام طلبك بنجاح!</h2>
          <p className="text-sm text-brown-soft">
            قبل أن نبدأ التجهيز — لديك فرصة واحدة لهذا العرض الحصري
          </p>
        </div>
        <UpsellOffer
          orderId={order.id}
          upsell={view}
          productId={productId}
          symbol={product?.currencySymbol ?? "د.ع"}
        />
      </div>
    </main>
  );
}
