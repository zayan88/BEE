import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import ProductForm from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function EditProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <PageHeader
        title="تعديل المنتج"
        subtitle={product.name}
        action={
          <Button asChild variant="outline" size="sm">
            <Link href={`/p/${product.slug}`} target="_blank">
              معاينة الصفحة ↗
            </Link>
          </Button>
        }
      />
      <ProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          tagline: product.tagline,
          description: product.description,
          price: product.price,
          compareAtPrice: product.compareAtPrice,
          currencySymbol: product.currencySymbol,
          stock: product.stock,
          shippingFee: product.shippingFee,
          freeShippingQty: product.freeShippingQty,
          active: product.active,
          heroBadge: product.heroBadge,
          rating: product.rating,
          ratingCount: product.ratingCount,
          metaTitle: product.metaTitle,
          metaDescription: product.metaDescription,
          ogImage: product.ogImage,
        }}
      />
    </>
  );
}
