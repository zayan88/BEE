import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/admin/Sidebar";

export const dynamic = "force-dynamic";
export const metadata = { title: "لوحة التحكم", robots: { index: false } };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login?callbackUrl=/admin");

  return (
    <div className="flex min-h-screen bg-cream" dir="rtl">
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <main className="thin-scroll flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-[1200px] px-5 py-8">{children}</div>
      </main>
    </div>
  );
}
