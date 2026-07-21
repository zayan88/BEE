import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const products = await prisma.product
    .findMany({ where: { active: true }, select: { slug: true, updatedAt: true } })
    .catch(() => []);

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...products.map((p) => ({
      url: `${base}/p/${p.slug}`,
      lastModified: p.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
  ];
}
