"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import type { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  productSchema,
  trackingSettingsSchema,
} from "@/lib/validations";
import { slugify } from "@/lib/utils";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) throw new Error("UNAUTHORIZED");
  return session;
}

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

function toFormObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [k, v] of formData.entries()) obj[k] = v;
  return obj;
}

export async function saveProduct(
  productId: string | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const obj = toFormObject(formData);
  obj.active = formData.get("active") === "on" || formData.get("active") === "true";
  if (!obj.slug || obj.slug === "") obj.slug = slugify(String(obj.name ?? ""));
  if (obj.freeShippingQty === "") obj.freeShippingQty = null;
  if (obj.compareAtPrice === "") obj.compareAtPrice = null;

  const parsed = productSchema.safeParse(obj);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "بيانات غير صالحة" };
  }
  const d = parsed.data;

  try {
    if (productId) {
      await prisma.product.update({
        where: { id: productId },
        data: {
          name: d.name,
          slug: d.slug,
          tagline: d.tagline || null,
          description: d.description || null,
          price: d.price,
          compareAtPrice: d.compareAtPrice ?? null,
          currencySymbol: d.currencySymbol,
          stock: d.stock,
          shippingFee: d.shippingFee,
          freeShippingQty: d.freeShippingQty ?? null,
          active: d.active,
          heroBadge: d.heroBadge || null,
          rating: d.rating,
          ratingCount: d.ratingCount,
          metaTitle: d.metaTitle || null,
          metaDescription: d.metaDescription || null,
          ogImage: d.ogImage || null,
        },
      });
      revalidatePath(`/admin/products/${productId}`);
      revalidatePath(`/p/${d.slug}`);
      return { ok: true, id: productId };
    }
    const created = await prisma.product.create({
      data: {
        name: d.name,
        slug: d.slug,
        tagline: d.tagline || null,
        description: d.description || null,
        price: d.price,
        compareAtPrice: d.compareAtPrice ?? null,
        currencySymbol: d.currencySymbol,
        stock: d.stock,
        shippingFee: d.shippingFee,
        freeShippingQty: d.freeShippingQty ?? null,
        active: d.active,
        heroBadge: d.heroBadge || null,
        rating: d.rating,
        ratingCount: d.ratingCount,
        metaTitle: d.metaTitle || null,
        metaDescription: d.metaDescription || null,
        ogImage: d.ogImage || null,
      },
    });
    revalidatePath("/admin/products");
    return { ok: true, id: created.id };
  } catch (e) {
    const msg =
      e instanceof Error && e.message.includes("Unique")
        ? "الرابط (slug) مستخدم بالفعل"
        : "تعذّر حفظ المنتج";
    return { ok: false, error: msg };
  }
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id: productId } });
    revalidatePath("/admin/products");
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر حذف المنتج" };
  }
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<ActionResult> {
  await requireAdmin();
  try {
    await prisma.order.update({ where: { id: orderId }, data: { status } });
    // Mark a Purchase-equivalent analytics event when delivered.
    if (status === "DELIVERED") {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: { items: true },
      });
      if (order) {
        await prisma.analyticsEvent.create({
          data: {
            type: "PURCHASE",
            productId: order.items[0]?.productId ?? null,
            orderId: order.id,
            value: order.total,
            province: order.province,
          },
        });
      }
    }
    revalidatePath("/admin/orders");
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر تحديث الحالة" };
  }
}

export async function saveTrackingSettings(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const parsed = trackingSettingsSchema.safeParse(toFormObject(formData));
  if (!parsed.success) return { ok: false, error: "بيانات غير صالحة" };
  const d = parsed.data;
  try {
    await prisma.trackingSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        metaPixelId: d.metaPixelId || null,
        tiktokPixelId: d.tiktokPixelId || null,
        googleAnalyticsId: d.googleAnalyticsId || null,
        googleTagManagerId: d.googleTagManagerId || null,
        snapchatPixelId: d.snapchatPixelId || null,
        customHeadScripts: d.customHeadScripts || null,
        customBodyScripts: d.customBodyScripts || null,
      },
      update: {
        metaPixelId: d.metaPixelId || null,
        tiktokPixelId: d.tiktokPixelId || null,
        googleAnalyticsId: d.googleAnalyticsId || null,
        googleTagManagerId: d.googleTagManagerId || null,
        snapchatPixelId: d.snapchatPixelId || null,
        customHeadScripts: d.customHeadScripts || null,
        customBodyScripts: d.customBodyScripts || null,
      },
    });
    revalidatePath("/admin/tracking");
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر حفظ الإعدادات" };
  }
}

export async function saveSiteSettings(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const storeName = String(formData.get("storeName") ?? "").trim();
  const supportPhone = String(formData.get("supportPhone") ?? "").trim();
  const supportEmail = String(formData.get("supportEmail") ?? "").trim();
  const defaultShipping = parseInt(
    String(formData.get("defaultShipping") ?? "0"),
    10,
  );
  const currencySymbol = String(formData.get("currencySymbol") ?? "د.ع").trim();
  if (storeName.length < 2) return { ok: false, error: "اسم المتجر مطلوب" };
  try {
    await prisma.siteSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        storeName,
        supportPhone: supportPhone || null,
        supportEmail: supportEmail || null,
        defaultShipping: Number.isFinite(defaultShipping) ? defaultShipping : 0,
        currencySymbol,
      },
      update: {
        storeName,
        supportPhone: supportPhone || null,
        supportEmail: supportEmail || null,
        defaultShipping: Number.isFinite(defaultShipping) ? defaultShipping : 0,
        currencySymbol,
      },
    });
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch {
    return { ok: false, error: "تعذّر حفظ الإعدادات" };
  }
}
