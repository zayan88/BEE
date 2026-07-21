"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/admin", label: "نظرة عامة", icon: "📊", exact: true },
  { href: "/admin/orders", label: "الطلبات", icon: "🧾" },
  { href: "/admin/products", label: "المنتجات", icon: "📦" },
  { href: "/admin/customers", label: "العملاء", icon: "👥" },
  { href: "/admin/analytics", label: "التحليلات", icon: "📈" },
  { href: "/admin/tracking", label: "مركز التتبع", icon: "🎯" },
  { href: "/admin/settings", label: "الإعدادات", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-l border-[rgba(200,147,46,0.15)] bg-white">
      <div className="flex items-center gap-2.5 px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-honey to-gold text-xl shadow-[var(--shadow-gold)]">
          🐝
        </span>
        <span className="font-display text-lg font-black text-brown">لوحة التحكم</span>
      </div>
      <nav className="flex-1 space-y-1 px-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-2.5 font-medium transition-colors",
                active
                  ? "bg-gradient-to-l from-[rgba(229,167,40,0.18)] to-[rgba(229,167,40,0.06)] font-bold text-gold-deep"
                  : "text-brown-soft hover:bg-cream",
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <button
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="m-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-brand-red transition-colors hover:bg-[rgba(197,69,59,0.06)]"
      >
        🚪 تسجيل الخروج
      </button>
    </aside>
  );
}
