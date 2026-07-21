import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatMoney, formatNumber } from "@/lib/utils";
import PageHeader from "@/components/admin/PageHeader";
import { Card } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orderItems: true, bundles: true } } },
  });

  return (
    <>
      <PageHeader
        title="المنتجات"
        subtitle={`${products.length} منتج`}
        action={
          <Button asChild size="sm">
            <Link href="/admin/products/new">+ منتج جديد</Link>
          </Button>
        }
      />

      <Card className="p-2">
        <Table>
          <THead>
            <TR>
              <TH>المنتج</TH>
              <TH>السعر</TH>
              <TH>المخزون</TH>
              <TH>الباقات</TH>
              <TH>الحالة</TH>
              <TH>الرابط</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {products.map((p) => (
              <TR key={p.id}>
                <TD className="font-bold">{p.name}</TD>
                <TD className="text-gold-deep">{formatMoney(p.price, p.currencySymbol)}</TD>
                <TD>{formatNumber(p.stock)}</TD>
                <TD>{p._count.bundles}</TD>
                <TD>
                  {p.active ? (
                    <Badge variant="green">منشور</Badge>
                  ) : (
                    <Badge variant="neutral">مسودة</Badge>
                  )}
                </TD>
                <TD>
                  <Link
                    href={`/p/${p.slug}`}
                    target="_blank"
                    className="text-xs text-gold-deep hover:underline"
                  >
                    /p/{p.slug} ↗
                  </Link>
                </TD>
                <TD>
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/products/${p.id}`}>تعديل</Link>
                    </Button>
                    <DeleteProductButton id={p.id} name={p.name} />
                  </div>
                </TD>
              </TR>
            ))}
            {products.length === 0 && (
              <TR>
                <TD colSpan={7} className="py-8 text-center text-brown-soft">
                  لا توجد منتجات. ابدأ بإضافة منتج جديد.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </>
  );
}
