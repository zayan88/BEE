import { prisma } from "@/lib/prisma";
import { formatMoney, formatDate } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function CustomersPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: {
      orders: { select: { total: true } },
    },
  });

  return (
    <>
      <PageHeader title="العملاء" subtitle={`${customers.length} عميل`} />
      <Card className="p-2">
        <Table>
          <THead>
            <TR>
              <TH>الاسم</TH>
              <TH>الهاتف</TH>
              <TH>المحافظة</TH>
              <TH>عدد الطلبات</TH>
              <TH>إجمالي الإنفاق</TH>
              <TH>أول طلب</TH>
            </TR>
          </THead>
          <TBody>
            {customers.map((c) => {
              const total = c.orders.reduce((s, o) => s + o.total, 0);
              return (
                <TR key={c.id}>
                  <TD className="font-bold">{c.fullName}</TD>
                  <TD dir="ltr" className="text-right">{c.phone}</TD>
                  <TD>{c.province ?? "—"}</TD>
                  <TD>{c.orders.length}</TD>
                  <TD className="font-bold text-gold-deep">{formatMoney(total)}</TD>
                  <TD className="whitespace-nowrap text-xs text-brown-soft">
                    {formatDate(c.createdAt)}
                  </TD>
                </TR>
              );
            })}
            {customers.length === 0 && (
              <TR>
                <TD colSpan={6} className="py-8 text-center text-brown-soft">
                  لا يوجد عملاء بعد.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </>
  );
}
