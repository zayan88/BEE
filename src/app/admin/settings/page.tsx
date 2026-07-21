import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import PageHeader from "@/components/admin/PageHeader";
import SettingsForm from "@/components/admin/SettingsForm";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, session] = await Promise.all([
    prisma.siteSettings.findUnique({ where: { id: "default" } }),
    getServerSession(authOptions),
  ]);

  return (
    <>
      <PageHeader title="الإعدادات" subtitle="إعدادات المتجر العامة" />
      <SettingsForm settings={settings} />
      <Card className="mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>الحساب</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-brown-soft">
          <div>البريد: {session?.user?.email}</div>
          <div>الصلاحية: {session?.user?.role ?? "ADMIN"}</div>
        </CardContent>
      </Card>
    </>
  );
}
