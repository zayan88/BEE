import type { OrderStatus } from "@prisma/client";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "قيد الانتظار",
  CONFIRMED: "مؤكد",
  SHIPPED: "تم الشحن",
  DELIVERED: "تم التوصيل",
  CANCELLED: "ملغي",
  RETURNED: "مُرتجع",
};

export const STATUS_VARIANT: Record<
  OrderStatus,
  "default" | "green" | "red" | "neutral" | "blue" | "purple"
> = {
  PENDING: "default",
  CONFIRMED: "blue",
  SHIPPED: "purple",
  DELIVERED: "green",
  CANCELLED: "red",
  RETURNED: "neutral",
};

export const ALL_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];
