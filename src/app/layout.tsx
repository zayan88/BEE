import type { Metadata } from "next";
import { Tajawal, Cairo } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  variable: "--font-tajawal",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  display: "swap",
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXTAUTH_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "متجر الدفع عند الاستلام",
    template: "%s | متجر الدفع عند الاستلام",
  },
  description:
    "منصة صفحات هبوط احترافية للبيع عند الاستلام مع نظام تتبع وتحليلات متكامل.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${tajawal.variable} ${cairo.variable}`}>
      <body className="min-h-screen bg-cream text-brown antialiased">
        {children}
      </body>
    </html>
  );
}
