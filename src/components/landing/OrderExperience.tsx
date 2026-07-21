"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { computePricing } from "@/lib/pricing";
import { orderSchema } from "@/lib/validations";
import { createOrder } from "@/server/actions/order";
import { track, getSessionId } from "@/lib/tracking";
import { formatMoney } from "@/lib/utils";
import { BundleView, ProductView } from "@/lib/funnel-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import SectionHead from "./SectionHead";

type FormValues = z.infer<typeof orderSchema>;

export default function OrderExperience({
  product,
  bundles,
  provinces,
  hasUpsell,
}: {
  product: ProductView;
  bundles: BundleView[];
  provinces: string[];
  hasUpsell: boolean;
}) {
  const router = useRouter();
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(
    bundles.find((b) => b.isPopular)?.id ?? bundles[0]?.id ?? null,
  );
  const [quantity, setQuantity] = useState(1);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const selectedBundle = bundles.find((b) => b.id === selectedBundleId) ?? null;

  const pricing = useMemo(
    () => computePricing(product, quantity, selectedBundle),
    [product, quantity, selectedBundle],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: product.id,
      quantity: 1,
      fullName: "",
      phone: "",
      province: "",
      city: "",
      address: "",
    },
  });

  const startCheckout = () => {
    if (!checkoutStarted) {
      setCheckoutStarted(true);
      track("INITIATE_CHECKOUT", {
        productId: product.id,
        value: pricing.total,
        contentName: product.name,
      });
    }
  };

  const selectBundle = (id: string) => {
    setSelectedBundleId(id);
    const b = bundles.find((x) => x.id === id);
    track("ADD_TO_CART", {
      productId: product.id,
      value: b?.price ?? product.price,
      contentName: product.name,
    });
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      productId: product.id,
      bundleId: selectedBundle?.id ?? null,
      quantity: pricing.quantity,
      source:
        new URLSearchParams(window.location.search).get("utm_source") ??
        "landing",
      sessionId: getSessionId(),
    };
    const res = await createOrder(payload);
    if (!res.ok) {
      if (res.fieldErrors) {
        for (const [k, v] of Object.entries(res.fieldErrors)) {
          setError(k as keyof FormValues, { message: v });
        }
      }
      setServerError(res.error);
      return;
    }
    track("ORDER_SUBMITTED", {
      productId: product.id,
      orderId: res.orderId,
      value: res.total,
      province: values.province,
    });
    track("PURCHASE", {
      productId: product.id,
      orderId: res.orderId,
      value: res.total,
      province: values.province,
    });
    router.push(hasUpsell ? `/upsell/${res.orderId}` : `/thank-you/${res.orderId}`);
  };

  return (
    <section
      id="offer"
      className="py-20 md:py-24"
      style={{
        background:
          "radial-gradient(ellipse at top,rgba(229,167,40,.15),transparent 60%),linear-gradient(180deg,var(--cream) 0%,var(--cream-deep) 100%)",
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <SectionHead
          eyebrow="العرض الخاص"
          title="اختر الباقة المناسبة لك"
          subtitle="كلما زادت الكمية زاد التوفير — دفع عند الاستلام في كل الحالات."
        />

        {bundles.length > 0 && (
          <div className="mx-auto mb-12 grid max-w-[900px] gap-5 md:grid-cols-3">
            {bundles.map((b) => {
              const active = b.id === selectedBundleId;
              return (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => selectBundle(b.id)}
                  className={
                    "relative rounded-[24px] border-2 bg-white p-6 text-center transition-all " +
                    (active
                      ? "border-gold shadow-[0_12px_30px_rgba(200,147,46,0.25)] md:scale-[1.03]"
                      : "border-[rgba(200,147,46,0.2)] hover:-translate-y-1 hover:shadow-md")
                  }
                >
                  {b.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-honey to-gold-deep px-4 py-1 font-display text-xs font-bold text-white">
                      الأكثر طلباً
                    </span>
                  )}
                  <div className="mb-1 font-display text-2xl font-black text-brown">
                    {b.label}
                  </div>
                  <div className="mb-2 text-sm text-brown-soft">
                    {b.quantity} قطعة
                  </div>
                  <div className="font-display text-3xl font-black text-gold-deep">
                    {formatMoney(b.price, product.currencySymbol)}
                  </div>
                  {b.compareAt && b.compareAt > b.price && (
                    <div className="mt-1 text-sm text-brown-soft line-through">
                      {formatMoney(b.compareAt, product.currencySymbol)}
                    </div>
                  )}
                  {b.freeShipping && (
                    <div className="mt-2 inline-block rounded-lg bg-[rgba(74,124,89,0.1)] px-3 py-1 text-xs font-bold text-brand-green">
                      🚚 شحن مجاني
                    </div>
                  )}
                  <div
                    className={
                      "mt-3 rounded-full py-2 text-sm font-bold " +
                      (active
                        ? "bg-gradient-to-br from-honey to-gold-deep text-white"
                        : "bg-cream-deep text-brown-soft")
                    }
                  >
                    {active ? "✓ محدد" : "اختر"}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* ORDER FORM */}
        <div
          id="order"
          className="relative mx-auto max-w-[680px] scroll-mt-24 rounded-[28px] border border-[rgba(200,147,46,0.15)] bg-white p-7 shadow-[var(--shadow-lg)] md:p-9"
        >
          <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-[28px] bg-gradient-to-l from-honey via-gold to-honey" />
          <div className="mb-7 text-center">
            <h3 className="mb-2 text-2xl">أكمل طلبك الآن</h3>
            <p className="text-[15px] text-brown-soft">
              املأ بياناتك وسنتصل بك لتأكيد الطلب — الدفع عند الاستلام.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} onFocus={startCheckout} noValidate>
            {!selectedBundle && (
              <div className="mb-4">
                <Label htmlFor="qty">الكمية</Label>
                <div className="mt-2 grid grid-cols-3 gap-2.5">
                  {[1, 2, 3].map((q) => (
                    <button
                      type="button"
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={
                        "rounded-[14px] border-2 px-2 py-3 text-center transition-all " +
                        (quantity === q
                          ? "border-gold bg-gradient-to-b from-white to-[rgba(245,215,142,0.25)] shadow-[0_6px_16px_rgba(200,147,46,0.25)]"
                          : "border-[rgba(200,147,46,0.2)] bg-cream")
                      }
                    >
                      <div className="font-display text-xl font-black text-brown">{q}</div>
                      <div className="text-xs text-brown-soft">
                        {formatMoney(product.price * q, product.currencySymbol)}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">
                  الاسم الكامل <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="fullName"
                  {...register("fullName")}
                  aria-invalid={!!errors.fullName}
                  placeholder="مثال: أحمد محمد"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <span className="text-xs font-semibold text-brand-red">
                    {errors.fullName.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="phone">
                  رقم الهاتف <span className="text-brand-red">*</span>
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  {...register("phone")}
                  aria-invalid={!!errors.phone}
                  placeholder="07XXXXXXXXX"
                  autoComplete="tel"
                />
                {errors.phone && (
                  <span className="text-xs font-semibold text-brand-red">
                    {errors.phone.message}
                  </span>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="province">
                    المحافظة <span className="text-brand-red">*</span>
                  </Label>
                  <Select
                    id="province"
                    {...register("province")}
                    aria-invalid={!!errors.province}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      اختر المحافظة
                    </option>
                    {provinces.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </Select>
                  {errors.province && (
                    <span className="text-xs font-semibold text-brand-red">
                      {errors.province.message}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="city">المدينة / القضاء</Label>
                  <Input id="city" {...register("city")} placeholder="اختياري" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="address">
                  العنوان بالتفصيل <span className="text-brand-red">*</span>
                </Label>
                <Textarea
                  id="address"
                  {...register("address")}
                  aria-invalid={!!errors.address}
                  placeholder="الحي، أقرب نقطة دالة، تفاصيل إضافية للتوصيل"
                />
                {errors.address && (
                  <span className="text-xs font-semibold text-brand-red">
                    {errors.address.message}
                  </span>
                )}
              </div>
            </div>

            {/* ORDER SUMMARY */}
            <div className="my-5 rounded-[18px] border border-dashed border-[rgba(200,147,46,0.4)] bg-gradient-to-br from-[rgba(245,215,142,0.25)] to-[rgba(229,167,40,0.1)] px-6 py-5">
              <div className="flex items-center justify-between py-1.5 text-[15px]">
                <span className="text-brown-soft">
                  المنتج ({pricing.quantity} قطعة)
                </span>
                <span className="font-bold text-brown">
                  {formatMoney(pricing.subtotal, product.currencySymbol)}
                </span>
              </div>
              {pricing.discount > 0 && (
                <div className="flex items-center justify-between py-1.5 text-[15px]">
                  <span className="text-brown-soft">الخصم</span>
                  <span className="font-bold text-brand-green">
                    -{formatMoney(pricing.discount, product.currencySymbol)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between py-1.5 text-[15px]">
                <span className="text-brown-soft">التوصيل</span>
                <span className="font-bold text-brown">
                  {pricing.shipping === 0
                    ? "مجاني"
                    : formatMoney(pricing.shipping, product.currencySymbol)}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t-2 border-dashed border-[rgba(200,147,46,0.3)] pt-3 font-display text-xl font-black text-gold-deep">
                <span>الإجمالي</span>
                <span>{formatMoney(pricing.total, product.currencySymbol)}</span>
              </div>
            </div>

            <div className="mb-5 flex flex-wrap justify-center gap-3 rounded-[18px] bg-[rgba(74,124,89,0.06)] p-3.5 text-xs font-semibold text-brand-green">
              <span>🔒 بياناتك آمنة</span>
              <span>💵 دفع عند الاستلام</span>
              <span>🚚 توصيل سريع</span>
              <span>↩️ ضمان الاستبدال</span>
            </div>

            {serverError && (
              <div className="mb-4 rounded-[14px] border-2 border-brand-red bg-[rgba(197,69,59,0.06)] px-4 py-3 text-center text-sm font-bold text-brand-red">
                {serverError}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? "جارٍ إرسال الطلب..." : "✅ تأكيد الطلب — دفع عند الاستلام"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
