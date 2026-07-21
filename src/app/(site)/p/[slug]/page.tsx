import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { PROVINCES } from "@/lib/provinces";
import { BundleView, ProductView } from "@/lib/funnel-types";
import LandingClient from "@/components/landing/LandingClient";
import ViewContentTracker from "@/components/tracking/ViewContentTracker";
import "./landing.css";

export const dynamic = "force-dynamic";

const DEFAULT_DISCLAIMER =
  "هذا المنتج هو منتج عناية يومية وليس دواءً طبياً ولا يُعتمد عليه لعلاج أو شفاء أو تشخيص أي حالة صحية. النتائج تختلف من شخص لآخر. في حال وجود حالة صحية معينة أو حساسية من أي من المكونات، يُرجى استشارة مختص قبل الاستعمال. تابع جميع التعليمات المدونة على العبوة.";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      bundles: { orderBy: { position: "asc" } },
      reviews: {
        where: { approved: true },
        orderBy: { position: "asc" },
        take: 12,
      },
      upsells: { where: { active: true }, orderBy: { position: "asc" }, take: 1 },
    },
  });
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const product = await prisma.product
    .findUnique({ where: { slug } })
    .catch(() => null);
  if (!product) return { title: "المنتج غير موجود" };

  const title = product.metaTitle || product.name;
  const description =
    product.metaDescription || product.tagline || product.name;
  const images = product.ogImage ? [product.ogImage] : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/p/${product.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      images,
      locale: "ar_IQ",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ProductFunnelPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const product = await getProduct(slug);
  if (!product || !product.active) notFound();

  const settings = await prisma.siteSettings
    .findUnique({ where: { id: "default" } })
    .catch(() => null);

  const productView: ProductView = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    compareAtPrice: product.compareAtPrice,
    currencySymbol: product.currencySymbol,
    shippingFee: product.shippingFee,
    freeShippingQty: product.freeShippingQty,
    stock: product.stock,
  };

  const bundles: BundleView[] = product.bundles.map((b) => ({
    id: b.id,
    label: b.label,
    quantity: b.quantity,
    price: b.price,
    compareAt: b.compareAt,
    freeShipping: b.freeShipping,
    isPopular: b.isPopular,
  }));

  const storeName = settings?.storeName ?? product.name;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription || product.tagline || product.name,
    image: product.ogImage ? [product.ogImage] : undefined,
    brand: { "@type": "Brand", name: storeName },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  const stockLeft =
    product.stock > 0 && product.stock < 50 ? product.stock : 18;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewContentTracker
        productId={product.id}
        value={product.price}
        name={product.name}
      />
      <LandingClient
        storeName={storeName}
        brandEmoji="🐝"
        product={productView}
        bundles={bundles}
        provinces={PROVINCES}
        reviews={product.reviews.map((r) => ({
          id: r.id,
          author: r.author,
          location: r.location,
          rating: r.rating,
          body: r.body,
        }))}
        rating={product.rating}
        ratingCount={product.ratingCount}
        hasUpsell={product.upsells.length > 0}
        tagline={product.tagline}
        heroBadge={product.heroBadge}
        heroImage={product.images[0]?.url}
        solutionImage={product.images[1]?.url ?? product.images[0]?.url}
        stockLeft={stockLeft}
        disclaimer={DEFAULT_DISCLAIMER}
      />
    </>
  );
}
