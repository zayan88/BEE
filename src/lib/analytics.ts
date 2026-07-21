import { prisma } from "@/lib/prisma";
import type { AnalyticsEventType } from "@prisma/client";

export type Metrics = {
  visitors: number;
  pageViews: number;
  viewContent: number;
  initiateCheckout: number;
  orders: number;
  deliveredOrders: number;
  revenue: number;
  deliveredRevenue: number;
  conversionRate: number;
  avgOrderValue: number;
  upsellShown: number;
  upsellAccepted: number;
  upsellAcceptanceRate: number;
  topProducts: { name: string; orders: number; revenue: number }[];
  topProvinces: { province: string; orders: number }[];
  daily: { date: string; orders: number; revenue: number }[];
};

function aggregateProducts(
  items: { name: string; quantity: number; unitPrice: number }[],
): { name: string; orders: number; revenue: number }[] {
  const map = new Map<string, { orders: number; revenue: number }>();
  for (const it of items) {
    const cur = map.get(it.name) ?? { orders: 0, revenue: 0 };
    cur.orders += it.quantity;
    cur.revenue += it.quantity * it.unitPrice;
    map.set(it.name, cur);
  }
  return Array.from(map.entries())
    .map(([name, v]) => ({ name, ...v }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
}

export async function getMetrics(days = 30): Promise<Metrics> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [
    events,
    orders,
    deliveredAgg,
    ordersAgg,
    upsellShown,
    upsellAccepted,
    orderItems,
    provinceRows,
  ] = await Promise.all([
    prisma.analyticsEvent.groupBy({
      by: ["type"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { createdAt: true, total: true, status: true, province: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: since }, status: "DELIVERED" },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.order.aggregate({
      where: { createdAt: { gte: since } },
      _sum: { total: true },
      _count: { _all: true },
    }),
    prisma.upsellEvent.count({
      where: { createdAt: { gte: since } },
    }),
    prisma.upsellEvent.count({
      where: { createdAt: { gte: since }, decision: "ACCEPTED" },
    }),
    prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: since } } },
      select: { name: true, quantity: true, unitPrice: true },
    }),
    prisma.order.groupBy({
      by: ["province"],
      where: { createdAt: { gte: since } },
      _count: { _all: true },
      orderBy: { _count: { province: "desc" } },
      take: 6,
    }),
  ]);

  const distinctVisitors = await prisma.analyticsEvent.findMany({
    where: { createdAt: { gte: since }, type: "PAGE_VIEW" },
    select: { sessionId: true },
    distinct: ["sessionId"],
  });

  const countOf = (t: AnalyticsEventType) =>
    events.find((e) => e.type === t)?._count._all ?? 0;

  const orderCount = ordersAgg._count._all;
  const revenue = ordersAgg._sum.total ?? 0;
  const deliveredRevenue = deliveredAgg._sum.total ?? 0;
  const visitors = distinctVisitors.filter((v) => v.sessionId).length;

  // Build a daily series.
  const dailyMap = new Map<string, { orders: number; revenue: number }>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dailyMap.set(d.toISOString().slice(0, 10), { orders: 0, revenue: 0 });
  }
  for (const o of orders) {
    const key = o.createdAt.toISOString().slice(0, 10);
    const cur = dailyMap.get(key);
    if (cur) {
      cur.orders += 1;
      cur.revenue += o.total;
    }
  }

  return {
    visitors,
    pageViews: countOf("PAGE_VIEW"),
    viewContent: countOf("VIEW_CONTENT"),
    initiateCheckout: countOf("INITIATE_CHECKOUT"),
    orders: orderCount,
    deliveredOrders: deliveredAgg._count._all,
    revenue,
    deliveredRevenue,
    conversionRate: visitors > 0 ? (orderCount / visitors) * 100 : 0,
    avgOrderValue: orderCount > 0 ? Math.round(revenue / orderCount) : 0,
    upsellShown,
    upsellAccepted,
    upsellAcceptanceRate:
      upsellShown > 0 ? (upsellAccepted / upsellShown) * 100 : 0,
    topProducts: aggregateProducts(orderItems),
    topProvinces: provinceRows.map((r) => ({
      province: r.province,
      orders: r._count._all,
    })),
    daily: Array.from(dailyMap.entries()).map(([date, v]) => ({
      date,
      orders: v.orders,
      revenue: v.revenue,
    })),
  };
}
