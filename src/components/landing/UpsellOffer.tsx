"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { recordUpsellDecision } from "@/server/actions/order";
import { track, getSessionId } from "@/lib/tracking";
import { formatMoney } from "@/lib/utils";
import { UpsellView } from "@/lib/funnel-types";
import { Button } from "@/components/ui/button";

export default function UpsellOffer({
  orderId,
  upsell,
  productId,
  symbol,
}: {
  orderId: string;
  upsell: UpsellView;
  productId: string;
  symbol: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<"accept" | "decline" | null>(null);

  const decide = async (accepted: boolean) => {
    setBusy(accepted ? "accept" : "decline");
    await recordUpsellDecision({
      orderId,
      upsellId: upsell.id,
      accepted,
      sessionId: getSessionId(),
    });
    track(accepted ? "UPSELL_ACCEPTED" : "UPSELL_REJECTED", {
      productId,
      orderId,
      value: accepted ? upsell.price : 0,
    });
    router.push(`/thank-you/${orderId}`);
  };

  return (
    <div className="relative mx-auto max-w-[560px] overflow-hidden rounded-[28px] border border-[rgba(200,147,46,0.2)] bg-white p-8 shadow-[var(--shadow-lg)]">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-l from-honey via-gold to-honey" />
      <div className="mb-4 text-center">
        <span className="inline-block rounded-full bg-[rgba(197,69,59,0.1)] px-4 py-1.5 font-display text-xs font-bold text-brand-red">
          ⏳ عرض لمرة واحدة — لن يتكرر
        </span>
      </div>
      <h1 className="mb-3 text-center text-[clamp(24px,5vw,34px)]">
        {upsell.title}
      </h1>
      {upsell.description && (
        <p className="mb-6 text-center leading-8 text-brown-soft">
          {upsell.description}
        </p>
      )}

      <div className="mb-6 rounded-[18px] border border-dashed border-[rgba(200,147,46,0.4)] bg-gradient-to-br from-[rgba(245,215,142,0.25)] to-[rgba(229,167,40,0.1)] p-6 text-center">
        <div className="mb-1 text-sm text-brown-soft">
          أضف {upsell.extraQuantity} قطعة إضافية الآن مقابل
        </div>
        <div className="font-display text-4xl font-black text-gold-deep">
          {formatMoney(upsell.price, symbol)}
        </div>
        {upsell.compareAt && upsell.compareAt > upsell.price && (
          <div className="mt-1 text-sm text-brown-soft line-through">
            بدلاً من {formatMoney(upsell.compareAt, symbol)}
          </div>
        )}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs font-bold text-brand-green">
          {upsell.discountPercent > 0 && (
            <span className="rounded-lg bg-[rgba(74,124,89,0.1)] px-3 py-1">
              خصم {upsell.discountPercent}%
            </span>
          )}
          {upsell.freeShipping && (
            <span className="rounded-lg bg-[rgba(74,124,89,0.1)] px-3 py-1">
              🚚 شحن مجاني
            </span>
          )}
        </div>
      </div>

      <div className="grid gap-3">
        <Button
          size="lg"
          className="w-full"
          disabled={busy !== null}
          onClick={() => decide(true)}
        >
          {busy === "accept" ? "جارٍ الإضافة..." : "✅ نعم، أضِف العرض إلى طلبي"}
        </Button>
        <Button
          variant="ghost"
          className="w-full text-brown-soft"
          disabled={busy !== null}
          onClick={() => decide(false)}
        >
          {busy === "decline" ? "..." : "لا شكراً، أكمل بدون العرض"}
        </Button>
      </div>
    </div>
  );
}
