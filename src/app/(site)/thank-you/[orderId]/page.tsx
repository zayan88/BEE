import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { formatMoney } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "تم تأكيد الطلب",
  robots: { index: false },
};

export default async function ThankYouPage(props: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await props.params;
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5 py-16">
      <div className="w-full max-w-[560px] rounded-[28px] border border-[rgba(200,147,46,0.15)] bg-white p-8 text-center shadow-[var(--shadow-lg)]">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-green to-[#3a6147] text-4xl text-white shadow-lg">
          ✓
        </div>
        <h1 className="mb-2 text-3xl text-brand-green">تم تأكيد طلبك!</h1>
        <p className="mb-6 text-brown-soft">
          شكراً لك. رقم طلبك هو{" "}
          <span className="font-display font-black text-brown">
            #{order.orderNumber}
          </span>
          . سيتصل بك فريقنا قريباً لتأكيد التفاصيل والتوصيل.
        </p>

        <div className="mb-6 rounded-[18px] border border-dashed border-[rgba(200,147,46,0.4)] bg-cream/70 p-5 text-right">
          {order.items.map((it) => (
            <div
              key={it.id}
              className="flex items-center justify-between py-1.5 text-sm"
            >
              <span className="text-brown-soft">
                {it.name} × {it.quantity}
              </span>
              <span className="font-bold text-brown">
                {formatMoney(it.unitPrice * it.quantity, order.currency === "IQD" ? "د.ع" : order.currency)}
              </span>
            </div>
          ))}
          <div className="mt-2 flex items-center justify-between border-t border-dashed border-[rgba(200,147,46,0.3)] pt-3 font-display text-lg font-black text-gold-deep">
            <span>الإجمالي (دفع عند الاستلام)</span>
            <span>{formatMoney(order.total, "د.ع")}</span>
          </div>
        </div>

        <div className="mb-6 grid gap-2 text-right text-sm text-brown-soft">
          <div>👤 {order.fullName}</div>
          <div>📞 {order.phone}</div>
          <div>📍 {order.province}{order.city ? ` - ${order.city}` : ""}</div>
          <div>🏠 {order.address}</div>
        </div>

        <Link
          href="/"
          className="inline-flex min-h-[54px] items-center justify-center rounded-full border-2 border-gold bg-white px-8 font-display font-extrabold text-gold-deep transition-all hover:bg-gold hover:text-white"
        >
          العودة للمتجر
        </Link>
      </div>
    </main>
  );
}
