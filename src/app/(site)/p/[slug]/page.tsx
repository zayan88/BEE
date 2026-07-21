import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { getContent } from "@/lib/content";
import { PROVINCES } from "@/lib/provinces";
import { BundleView, ProductView } from "@/lib/funnel-types";
import TopBar from "@/components/landing/TopBar";
import SiteHeader from "@/components/landing/SiteHeader";
import Hero from "@/components/landing/Hero";
import {
  ProblemSection,
  SolutionSection,
  BenefitsSection,
  IngredientsSection,
  StepsSection,
  WhyUsSection,
} from "@/components/landing/Sections";
import Reviews from "@/components/landing/Reviews";
import Faq from "@/components/landing/Faq";
import OrderExperience from "@/components/landing/OrderExperience";
import StickyCta from "@/components/landing/StickyCta";
import Footer from "@/components/landing/Footer";
import ViewContentTracker from "@/components/tracking/ViewContentTracker";

export const dynamic = "force-dynamic";

async function getProduct(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      bundles: { orderBy: { position: "asc" } },
      reviews: {
        where: { approved: true },
        orderBy: { position: "asc" },
        take: 9,
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

  const content = getContent(product.content);
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.metaDescription || product.tagline || product.name,
    image: product.ogImage ? [product.ogImage] : undefined,
    brand: { "@type": "Brand", name: settings?.storeName ?? "متجر" },
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

  const storeName = settings?.storeName ?? product.name;

  return (
    <div className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ViewContentTracker
        productId={product.id}
        value={product.price}
        name={product.name}
      />
      <TopBar items={content.topbar ?? []} />
      <SiteHeader name={storeName} />
      <main>
        <Hero
          product={productView}
          content={content}
          tagline={product.tagline}
          heroBadge={product.heroBadge}
          rating={product.rating}
          ratingCount={product.ratingCount}
          image={product.images[0]?.url}
        />
        <ProblemSection data={content.problem} />
        <SolutionSection data={content.solution} />
        <BenefitsSection data={content.benefits} />
        <IngredientsSection data={content.ingredients} />
        <StepsSection data={content.steps} />
        <WhyUsSection data={content.whyus} />
        <Reviews
          reviews={product.reviews.map((r) => ({
            id: r.id,
            author: r.author,
            location: r.location,
            rating: r.rating,
            body: r.body,
          }))}
          rating={product.rating}
          ratingCount={product.ratingCount}
        />
        <OrderExperience
          product={productView}
          bundles={bundles}
          provinces={PROVINCES}
          hasUpsell={product.upsells.length > 0}
        />
        <Faq data={content.faq} />
      </main>
      <Footer name={storeName} phone={settings?.supportPhone} />
      <StickyCta price={product.price} symbol={product.currencySymbol} />
    </div>
  );
}
