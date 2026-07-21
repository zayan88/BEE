export default function TopBar({ items }: { items: string[] }) {
  const list = items.length ? items : [
    "🚚 توصيل سريع لكل المحافظات",
    "💵 دفع عند الاستلام",
    "🌿 مكونات طبيعية مختارة",
    "🔒 طلب آمن وموثوق",
  ];
  const doubled = [...list, ...list];
  return (
    <div className="overflow-hidden bg-gradient-to-l from-brown to-brown-soft py-2 text-[13px] font-medium text-white">
      <div className="flex w-max animate-marquee gap-[60px] whitespace-nowrap">
        {doubled.map((t, i) => (
          <span key={i} className="flex items-center gap-2">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
