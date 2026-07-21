"use client";

import { useEffect, useState } from "react";
import { formatMoney } from "@/lib/utils";

export default function StickyCta({
  price,
  symbol,
}: {
  price: number;
  symbol: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      onClick={() =>
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" })
      }
      className={
        "btn-shine fixed bottom-5 left-1/2 z-[85] flex -translate-x-1/2 items-center gap-2.5 rounded-full border-2 border-white/25 bg-gradient-to-br from-honey via-gold to-gold-deep px-7 py-3.5 font-display font-black text-white shadow-[0_12px_32px_rgba(200,147,46,0.45)] transition-all lg:left-6 lg:translate-x-0 " +
        (show
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-6 opacity-0")
      }
      aria-label="اطلب الآن"
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-base">
        🛒
      </span>
      <span className="flex flex-col items-start leading-tight">
        <span className="text-base font-black">اطلب الآن</span>
        <span className="text-[11px] font-semibold opacity-85">
          يبدأ من {formatMoney(price, symbol)} · دفع عند الاستلام
        </span>
      </span>
    </button>
  );
}
