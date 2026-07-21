import { z } from "zod";
import { PROVINCES } from "@/lib/provinces";

// Arabic-friendly phone: allow digits, spaces, +, -, must be 7-15 digits.
const phoneRegex = /^[+]?[0-9\s-]{7,20}$/;

export const orderSchema = z.object({
  productId: z.string().min(1),
  bundleId: z.string().optional().nullable(),
  quantity: z.coerce.number().int().min(1).max(20),
  fullName: z
    .string()
    .trim()
    .min(3, "الرجاء إدخال الاسم الكامل")
    .max(120),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, "رقم هاتف غير صالح")
    .transform((v) => v.replace(/[\s-]/g, "")),
  province: z
    .string()
    .trim()
    .refine((v) => PROVINCES.includes(v), "الرجاء اختيار المحافظة"),
  city: z.string().trim().max(120).optional().or(z.literal("")),
  address: z
    .string()
    .trim()
    .min(5, "الرجاء إدخال العنوان بالتفصيل")
    .max(500),
  source: z.string().trim().max(60).optional(),
  sessionId: z.string().trim().max(120).optional(),
});

export type OrderInput = z.infer<typeof orderSchema>;

export const upsellDecisionSchema = z.object({
  orderId: z.string().min(1),
  upsellId: z.string().min(1),
  accepted: z.boolean(),
  sessionId: z.string().max(120).optional(),
});

export const trackEventSchema = z.object({
  type: z.enum([
    "PAGE_VIEW",
    "VIEW_CONTENT",
    "ADD_TO_CART",
    "INITIATE_CHECKOUT",
    "LEAD",
    "PURCHASE",
    "UPSELL_ACCEPTED",
    "UPSELL_REJECTED",
    "ORDER_SUBMITTED",
  ]),
  productId: z.string().optional().nullable(),
  orderId: z.string().optional().nullable(),
  sessionId: z.string().max(120).optional().nullable(),
  value: z.coerce.number().int().min(0).default(0),
  province: z.string().max(60).optional().nullable(),
  source: z.string().max(60).optional().nullable(),
  path: z.string().max(300).optional().nullable(),
});

// Admin product form
export const productSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().min(2).max(200),
  tagline: z.string().trim().max(300).optional().or(z.literal("")),
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  currencySymbol: z.string().trim().max(10).default("د.ع"),
  stock: z.coerce.number().int().min(0).default(0),
  shippingFee: z.coerce.number().int().min(0).default(0),
  freeShippingQty: z.coerce.number().int().min(0).optional().nullable(),
  active: z.coerce.boolean().default(true),
  heroBadge: z.string().trim().max(200).optional().or(z.literal("")),
  rating: z.coerce.number().min(0).max(5).default(4.9),
  ratingCount: z.coerce.number().int().min(0).default(0),
  metaTitle: z.string().trim().max(200).optional().or(z.literal("")),
  metaDescription: z.string().trim().max(400).optional().or(z.literal("")),
  ogImage: z.string().trim().max(500).optional().or(z.literal("")),
});

export const trackingSettingsSchema = z.object({
  metaPixelId: z.string().trim().max(60).optional().or(z.literal("")),
  tiktokPixelId: z.string().trim().max(60).optional().or(z.literal("")),
  googleAnalyticsId: z.string().trim().max(60).optional().or(z.literal("")),
  googleTagManagerId: z.string().trim().max(60).optional().or(z.literal("")),
  snapchatPixelId: z.string().trim().max(60).optional().or(z.literal("")),
  customHeadScripts: z.string().max(20000).optional().or(z.literal("")),
  customBodyScripts: z.string().max(20000).optional().or(z.literal("")),
});
