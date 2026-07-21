export default function Footer({
  name,
  phone,
}: {
  name: string;
  phone?: string | null;
}) {
  return (
    <footer className="bg-[#1a0e07] px-5 pb-6 pt-10 text-center text-[13px] text-white/60">
      <div className="mb-2.5 font-display text-lg font-black text-white">{name}</div>
      <div className="mb-4 flex flex-wrap justify-center gap-5">
        <a href="#benefits" className="hover:text-honey">المميزات</a>
        <a href="#reviews" className="hover:text-honey">آراء العملاء</a>
        <a href="#faq" className="hover:text-honey">الأسئلة الشائعة</a>
        <a href="#order" className="hover:text-honey">اطلب الآن</a>
        {phone && <a href={`tel:${phone}`} className="hover:text-honey">اتصل بنا: {phone}</a>}
      </div>
      <div className="mx-auto max-w-[680px] border-t border-white/10 pt-4 text-xs leading-7 text-white/40">
        هذا المنتج ليس دواءً ولا يُغني عن استشارة الطبيب المختص. المعلومات المذكورة
        لأغراض تعريفية فقط. جميع الحقوق محفوظة © {new Date().getFullYear()} {name}.
      </div>
    </footer>
  );
}
