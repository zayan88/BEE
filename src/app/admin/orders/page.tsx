import Link from "next/link";
import type { OrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/order-status";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OrdersPage(props: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const sp = await props.searchParams;
  const statusFilter = ALL_STATUSES.includes(sp.status as OrderStatus)
    ? (sp.status as OrderStatus)
    : undefined;

  const where: Prisma.OrderWhereInput = {};
  if (statusFilter) where.status = statusFilter;
  if (sp.q) {
    where.OR = [
      { fullName: { contains: sp.q, mode: "insensitive" } },
      { phone: { contains: sp.q } },
    ];
  }

  const orders = await prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
    include: { items: { where: { isUpsell: false }, take: 1 } },
  });

  return (
    <>
      <PageHeader title="الطلبات" subtitle={`${orders.length} طلب`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
            !statusFilter
              ? "bg-gold text-white"
              : "bg-white text-brown-soft hover:bg-cream-deep",
          )}
        >
          الكل
        </Link>
        {ALL_STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-bold transition-colors",
              statusFilter === s
                ? "bg-gold text-white"
                : "bg-white text-brown-soft hover:bg-cream-deep",
            )}
          >
            {STATUS_LABELS[s]}
          </Link>
        ))}
      </div>

      <Card className="p-2">
        <Table>
          <THead>
            <TR>
              <TH>#</TH>
              <TH>العميل</TH>
              <TH>الهاتف</TH>
              <TH>المحافظة</TH>
              <TH>المنتج</TH>
              <TH>الكمية</TH>
              <TH>الإجمالي</TH>
              <TH>المصدر</TH>
              <TH>التاريخ</TH>
              <TH>الحالة</TH>
            </TR>
          </THead>
          <TBody>
            {orders.map((o) => (
              <TR key={o.id}>
                <TD className="font-bold">#{o.orderNumber}</TD>
                <TD>{o.fullName}</TD>
                <TD dir="ltr" className="text-right">{o.phone}</TD>
                <TD>{o.province}</TD>
                <TD className="max-w-[180px] truncate">{o.items[0]?.name ?? "—"}</TD>
                <TD>{o.items[0]?.quantity ?? "—"}</TD>
                <TD className="font-bold text-gold-deep">{formatMoney(o.total)}</TD>
                <TD className="text-xs text-brown-soft">{o.source}</TD>
                <TD className="whitespace-nowrap text-xs text-brown-soft">
                  {formatDate(o.createdAt)}
                </TD>
                <TD>
                  <OrderStatusSelect orderId={o.id} status={o.status} />
                </TD>
              </TR>
            ))}
            {orders.length === 0 && (
              <TR>
                <TD colSpan={10} className="py-8 text-center text-brown-soft">
                  لا توجد طلبات مطابقة.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </>
  );
}
