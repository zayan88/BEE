import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/admin/PageHeader";
import TrackingForm from "@/components/admin/TrackingForm";

export const dynamic = "force-dynamic";

export default async function TrackingPage() {
  const settings = await prisma.trackingSettings.findUnique({
    where: { id: "default" },
  });

  return (
    <>
      <PageHeader
        title="مركز التتبع"
        subtitle="ثبّت البكسلات وأدوات التحليل — تُحقن تلقائياً في صفحات المتجر"
      />
      <TrackingForm settings={settings} />
    </>
  );
}
