"use server";

import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { orderSchema, upsellDecisionSchema } from "@/lib/validations";
import { computePricing } from "@/lib/pricing";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export type CreateOrderState =
  | { ok: true; orderId: string; orderNumber: number; total: number }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export async function createOrder(
  raw: unknown,
): Promise<CreateOrderState> {
  const h = await headers();
  const ip = getClientIp(h);
  const { success } = rateLimit(`order:${ip}`, { limit: 8, windowMs: 60_000 });
  if (!success) {
    return { ok: false, error: "عدد كبير من المحاولات، حاول بعد قليل." };
  }

  const parsed = orderSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "الرجاء التحقق من البيانات.", fieldErrors };
  }

  const data = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: data.productId },
  });
  if (!product || !product.active) {
    return { ok: false, error: "المنتج غير متوفر." };
  }

  const bundle = data.bundleId
    ? await prisma.bundle.findUnique({ where: { id: data.bundleId } })
    : null;
  if (data.bundleId && (!bundle || bundle.productId !== product.id)) {
    return { ok: false, error: "الباقة غير صالحة." };
  }

  const pricing = computePricing(product, data.quantity, bundle);

  try {
    const order = await prisma.$transaction(async (tx) => {
      const customer = await tx.customer.upsert({
        where: { phone: data.phone },
        create: {
          fullName: data.fullName,
          phone: data.phone,
          province: data.province,
          city: data.city || null,
          address: data.address,
        },
        update: {
          fullName: data.fullName,
          province: data.province,
          city: data.city || null,
          address: data.address,
        },
      });

      const created = await tx.order.create({
        data: {
          customerId: customer.id,
          fullName: data.fullName,
          phone: data.phone,
          province: data.province,
          city: data.city || null,
          address: data.address,
          bundleId: bundle?.id ?? null,
          subtotal: pricing.subtotal,
          discount: pricing.discount,
          shipping: pricing.shipping,
          total: pricing.total,
          currency: product.currency,
          source: data.source || "landing",
          items: {
            create: {
              productId: product.id,
              name: product.name,
              unitPrice: pricing.unitPrice,
              quantity: pricing.quantity,
            },
          },
        },
      });

      // Best-effort stock decrement (never below zero).
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: Math.min(product.stock, pricing.quantity) } },
      });

      await tx.analyticsEvent.createMany({
        data: [
          {
            type: "ORDER_SUBMITTED",
            productId: product.id,
            orderId: created.id,
            sessionId: data.sessionId ?? null,
            value: pricing.total,
            province: data.province,
            source: data.source ?? "landing",
          },
          {
            type: "LEAD",
            productId: product.id,
            orderId: created.id,
            sessionId: data.sessionId ?? null,
            value: pricing.total,
            province: data.province,
            source: data.source ?? "landing",
          },
        ],
      });

      return created;
    });

    return {
      ok: true,
      orderId: order.id,
      orderNumber: order.orderNumber,
      total: order.total,
    };
  } catch {
    return { ok: false, error: "تعذّر إنشاء الطلب، حاول مرة أخرى." };
  }
}

export type UpsellState = { ok: boolean; error?: string };

export async function recordUpsellDecision(
  raw: unknown,
): Promise<UpsellState> {
  const parsed = upsellDecisionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "بيانات غير صالحة." };
  const { orderId, upsellId, accepted } = parsed.data;

  const [order, upsell] = await Promise.all([
    prisma.order.findUnique({ where: { id: orderId } }),
    prisma.upsell.findUnique({ where: { id: upsellId } }),
  ]);
  if (!order || !upsell) return { ok: false, error: "الطلب غير موجود." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.upsellEvent.create({
        data: {
          upsellId,
          orderId,
          decision: accepted ? "ACCEPTED" : "REJECTED",
        },
      });

      await tx.analyticsEvent.create({
        data: {
          type: accepted ? "UPSELL_ACCEPTED" : "UPSELL_REJECTED",
          productId: upsell.productId,
          orderId,
          value: accepted ? upsell.price : 0,
          province: order.province,
        },
      });

      if (accepted) {
        await tx.orderItem.create({
          data: {
            orderId,
            productId: upsell.productId,
            name: `${upsell.title} (عرض إضافي)`,
            unitPrice: upsell.price,
            quantity: upsell.extraQuantity,
            isUpsell: true,
          },
        });
        const extraShipping = 0;
        await tx.order.update({
          where: { id: orderId },
          data: {
            hasUpsell: true,
            subtotal: { increment: upsell.price },
            total: { increment: upsell.price + extraShipping },
          },
        });
      }
    });
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر تسجيل العرض." };
  }
}
