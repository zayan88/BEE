import Link from "next/link";

export default function SiteHeader({ name }: { name: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(200,147,46,0.15)] bg-[rgba(251,247,240,0.85)] py-3.5 backdrop-blur-lg backdrop-saturate-150">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-5 px-5">
        <Link href="#hero" className="flex items-center gap-2.5 font-display text-xl font-black text-brown">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-honey to-gold text-[22px] shadow-[var(--shadow-gold)]">
            🐝
          </span>
          <span className="truncate">{name}</span>
        </Link>
        <nav className="hidden gap-7 font-medium md:flex" aria-label="القائمة الرئيسية">
          <a href="#benefits" className="text-[15px] transition-colors hover:text-gold">المميزات</a>
          <a href="#ingredients" className="text-[15px] transition-colors hover:text-gold">المكونات</a>
          <a href="#reviews" className="text-[15px] transition-colors hover:text-gold">آراء العملاء</a>
          <a href="#offer" className="text-[15px] transition-colors hover:text-gold">العروض</a>
          <a href="#faq" className="text-[15px] transition-colors hover:text-gold">الأسئلة</a>
        </nav>
        <a
          href="#order"
          className="btn-shine inline-flex min-h-[42px] items-center justify-center rounded-full bg-gradient-to-br from-honey via-gold to-gold-deep px-5 py-2.5 font-display text-sm font-extrabold text-white shadow-[0_8px_24px_rgba(200,147,46,0.4)]"
        >
          اطلب الآن
        </a>
      </div>
    </header>
  );
}
