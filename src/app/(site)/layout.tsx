import { Suspense } from "react";
import PixelScripts from "@/components/tracking/PixelScripts";
import PageViewTracker from "@/components/tracking/PageViewTracker";
import { prisma } from "@/lib/prisma";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await prisma.trackingSettings
    .findUnique({ where: { id: "default" } })
    .catch(() => null);

  return (
    <>
      <PixelScripts settings={settings} />
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </>
  );
}
