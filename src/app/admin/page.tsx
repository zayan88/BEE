import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getMetrics } from "@/lib/analytics";
import { formatMoney, formatNumber, formatDate } from "@/lib/utils";
import StatCard from "@/components/admin/StatCard";
import PageHeader from "@/components/admin/PageHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, STATUS_VARIANT } from "@/lib/order-status";

export const dynamic = "force-dynamic";

export default async function OverviewPage() {
  const m = await getMetrics(30);
  const recent = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <>
      <PageHeader
        title="نظرة عامة"
        subtitle="ملخص آخر 30 يوماً"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="الإيرادات" value={formatMoney(m.revenue)} icon="💰" hint={`${formatNumber(m.orders)} طلب`} />
        <StatCard label="الطلبات" value={formatNumber(m.orders)} icon="🧾" hint={`${formatNumber(m.deliveredOrders)} تم التوصيل`} />
        <StatCard label="الزوّار" value={formatNumber(m.visitors)} icon="👀" hint={`${formatNumber(m.pageViews)} مشاهدة`} />
        <StatCard label="معدل التحويل" value={`${m.conversionRate.toFixed(1)}%`} icon="⚡" hint={`متوسط الطلب ${formatMoney(m.avgOrderValue)}`} />
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="بدء الدفع" value={formatNumber(m.initiateCheckout)} icon="🛒" />
        <StatCard label="مشاهدة المنتج" value={formatNumber(m.viewContent)} icon="🔍" />
        <StatCard label="قبول العروض الإضافية" value={`${m.upsellAcceptanceRate.toFixed(0)}%`} icon="📈" hint={`${m.upsellAccepted}/${m.upsellShown}`} />
        <StatCard label="إيراد الطلبات الموصلة" value={formatMoney(m.deliveredRevenue)} icon="✅" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>أحدث الطلبات</CardTitle>
          <Link href="/admin/orders" className="text-sm font-bold text-gold-deep hover:underline">
            عرض الكل
          </Link>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <p className="py-6 text-center text-sm text-brown-soft">لا توجد طلبات بعد.</p>
          ) : (
            <div className="divide-y divide-[rgba(200,147,46,0.1)]">
              {recent.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <div className="font-bold text-brown">#{o.orderNumber} · {o.fullName}</div>
                    <div className="text-xs text-brown-soft">
                      {o.province} · {formatDate(o.createdAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-display font-black text-gold-deep">
                      {formatMoney(o.total)}
                    </span>
                    <Badge variant={STATUS_VARIANT[o.status]}>
                      {STATUS_LABELS[o.status]}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
