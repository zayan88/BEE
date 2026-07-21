import Link from "next/link";
import { getMetrics } from "@/lib/analytics";
import { formatMoney, formatNumber } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import StatCard from "@/components/admin/StatCard";
import RevenueChart from "@/components/admin/RevenueChart";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const RANGES = [
  { days: 7, label: "7 أيام" },
  { days: 30, label: "30 يوم" },
  { days: 90, label: "90 يوم" },
];

export default async function AnalyticsPage(props: {
  searchParams: Promise<{ days?: string }>;
}) {
  const sp = await props.searchParams;
  const days = [7, 30, 90].includes(Number(sp.days)) ? Number(sp.days) : 30;
  const m = await getMetrics(days);

  const funnel = [
    { label: "زوّار", value: m.visitors },
    { label: "مشاهدة المنتج", value: m.viewContent },
    { label: "بدء الدفع", value: m.initiateCheckout },
    { label: "طلبات", value: m.orders },
    { label: "تم التوصيل", value: m.deliveredOrders },
  ];
  const maxFunnel = Math.max(...funnel.map((f) => f.value), 1);

  return (
    <>
      <PageHeader
        title="التحليلات"
        subtitle={`آخر ${days} يوماً`}
        action={
          <div className="flex gap-2">
            {RANGES.map((r) => (
              <Link
                key={r.days}
                href={`/admin/analytics?days=${r.days}`}
                className={cn(
                  "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
                  days === r.days
                    ? "bg-gold text-white"
                    : "bg-white text-brown-soft hover:bg-cream-deep",
                )}
              >
                {r.label}
              </Link>
            ))}
          </div>
        }
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="الزوّار" value={formatNumber(m.visitors)} icon="👀" />
        <StatCard label="مشاهدات الصفحة" value={formatNumber(m.pageViews)} icon="📄" />
        <StatCard label="بدء الدفع" value={formatNumber(m.initiateCheckout)} icon="🛒" />
        <StatCard label="الطلبات" value={formatNumber(m.orders)} icon="🧾" />
        <StatCard label="الطلبات الموصلة" value={formatNumber(m.deliveredOrders)} icon="✅" />
        <StatCard label="الإيرادات" value={formatMoney(m.revenue)} icon="💰" />
        <StatCard label="متوسط قيمة الطلب" value={formatMoney(m.avgOrderValue)} icon="📊" />
        <StatCard label="معدل التحويل" value={`${m.conversionRate.toFixed(1)}%`} icon="⚡" />
      </div>

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الإيرادات اليومية</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart data={m.daily} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>قمع التحويل</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {funnel.map((f) => (
              <div key={f.label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-brown-soft">{f.label}</span>
                  <span className="font-bold text-brown">{formatNumber(f.value)}</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-cream-deep">
                  <div
                    className="h-full rounded-full bg-gradient-to-l from-honey to-gold-deep"
                    style={{ width: `${(f.value / maxFunnel) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>أفضل المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            {m.topProducts.length === 0 ? (
              <p className="py-4 text-center text-sm text-brown-soft">لا توجد بيانات.</p>
            ) : (
              <div className="divide-y divide-[rgba(200,147,46,0.1)]">
                {m.topProducts.map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-2.5">
                    <span className="text-brown">{p.name}</span>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-brown-soft">{formatNumber(p.orders)} قطعة</span>
                      <span className="font-bold text-gold-deep">{formatMoney(p.revenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>أفضل المحافظات</CardTitle>
          </CardHeader>
          <CardContent>
            {m.topProvinces.length === 0 ? (
              <p className="py-4 text-center text-sm text-brown-soft">لا توجد بيانات.</p>
            ) : (
              <div className="divide-y divide-[rgba(200,147,46,0.1)]">
                {m.topProvinces.map((p) => (
                  <div key={p.province} className="flex items-center justify-between py-2.5">
                    <span className="text-brown">📍 {p.province}</span>
                    <span className="font-bold text-brown-soft">{formatNumber(p.orders)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <StatCard
          label="معدل قبول العروض الإضافية (Upsell)"
          value={`${m.upsellAcceptanceRate.toFixed(0)}%`}
          icon="📈"
          hint={`${m.upsellAccepted} مقبول من ${m.upsellShown} عرض`}
        />
      </div>
    </>
  );
}
