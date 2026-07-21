import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin user ----
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "admin12345";
  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.upsert({
    where: { email },
    create: { email, name: "المدير", passwordHash, role: "ADMIN" },
    update: { passwordHash },
  });
  console.log(`✓ admin user: ${email}`);

  // ---- Site + tracking settings ----
  await prisma.siteSettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      storeName: "كريم سم النحل",
      supportPhone: "07700000000",
      currencySymbol: "د.ع",
    },
    update: {},
  });
  await prisma.trackingSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });

  // ---- Product content (bee venom cream) ----
  const content = {
    topbar: [
      "🚚 توصيل سريع لكل المحافظات",
      "💵 دفع عند الاستلام",
      "🌿 مكونات طبيعية مختارة",
      "🏆 منتج مختار بعناية",
      "🔒 طلب آمن وموثوق",
    ],
    trustPills: ["🚚 توصيل سريع", "💵 دفع عند الاستلام", "🌿 مكونات طبيعية", "🔒 طلب آمن"],
    problem: {
      eyebrow: "المشكلة",
      title: "حين تصبح الحركة اليومية تحدياً...",
      subtitle:
        "كلنا نمر بلحظات نشعر فيها أن أجسادنا لا تستجيب كما كانت. هذا الإحساس طبيعي، لكنه لا يعني أن نقبل به دون أن نفعل شيئاً.",
      quote:
        "«بدأت ألاحظ أن صعود الدرج لم يعد سهلاً كما كان. التيبس الصباحي صار يرافقني، والمشي لمسافات طويلة أصبح حلماً مؤجلاً.»",
      paragraph:
        "هذه ليست حالة واحدة، بل قصة يتشاركها كثيرون فوق سن الـ35. الإحساس بعدم الراحة في الركبة، التعب بعد نشاط بسيط، التيبس عند الاستيقاظ... كلها إشارات يستجيب لها الجسم.",
      items: [
        { icon: "🦵", text: "تيبس صباحي يجعل بداية يومك أبطأ من المعتاد" },
        { icon: "🪜", text: "صعوبة في صعود الدرج أو النزول منه بحرية" },
        { icon: "🚶", text: "انزعاج أثناء المشي لمسافات طويلة" },
        { icon: "🛌", text: "تعب بعد النشاط البدني يستمر لساعات" },
      ],
      cards: [
        { emoji: "🦵", label: "تيبس الركبة" },
        { emoji: "🪜", label: "صعوبة الدرج" },
        { emoji: "🚶", label: "ألم المشي" },
        { emoji: "🌅", label: "بداية صعبة" },
      ],
    },
    solution: {
      eyebrow: "الحل",
      title: "الحل الطبيعي الذي يندمج مع روتينك اليومي",
      subtitle:
        "كريم سم النحل الطبيعي يجمع بين مكونات منتقاة بعناية في تركيبة واحدة عملية.",
      heading: "منتج صُمم ليتناسب مع حياتك",
      paragraph:
        "تركيبة خفيفة، رائحة لطيفة، وعبوة عملية تستعملها في دقائق دون أن تضيف عبئاً إلى يومك.",
      features: [
        { title: "سهل الاستخدام", desc: "عبوة بمضخة عملية توزّع الكمية المناسبة بضغطة واحدة." },
        { title: "سريع الامتصاص", desc: "يتغلغل بسرعة داخل الجلد دون انتظار طويل." },
        { title: "تركيبة غير دهنية", desc: "خفيفة على البشرة، نظيفة على الملابس." },
        { title: "مكونات طبيعية مختارة", desc: "سم النحل، الكركم، الجلوكوزامين، أرنيكا وكوندرويتين." },
      ],
    },
    benefits: {
      eyebrow: "المميزات",
      title: "لماذا يختار العملاء كريم سم النحل؟",
      subtitle: "ست مزايا تجعل منه خياراً عملياً ومدروساً لدعم راحتك اليومية.",
      items: [
        { icon: "⚡", title: "سريع الامتصاص", desc: "يتغلغل بسرعة داخل الجلد لتشعر بالانتعاش في وقت قصير." },
        { icon: "✨", title: "لا يترك ملمس دهني", desc: "تركيبة خفيفة لا تترك أثراً على الملابس." },
        { icon: "🤲", title: "سهل الاستخدام", desc: "تحكّم بالكمية بسهولة دون فوضى أو هدر." },
        { icon: "🌞", title: "للاستخدام اليومي", desc: "لطيف يمكن دمجه في روتينك صباحاً ومساءً." },
        { icon: "🛁", title: "عبوة بمضخة عملية", desc: "مضخة محكمة توزّع الكمية المناسبة بضغطة واحدة." },
        { icon: "🌿", title: "مكونات طبيعية مختارة", desc: "مزيج مدروس من مكونات طبيعية منتقاة بعناية." },
      ],
    },
    ingredients: {
      eyebrow: "المكونات",
      title: "مكونات طبيعية منتقاة بعناية",
      subtitle: "خمسة مكونات طبيعية معروفة في الرعاية التقليدية.",
      items: [
        { emoji: "🐝", name: "سم النحل", en: "Bee Venom", desc: "مكون طبيعي يُعرف بخصائصه المنشطة للبشرة." },
        { emoji: "🫚", name: "الكركم", en: "Turmeric Root", desc: "غني بمركبات طبيعية تساعد على دعم مرونة الجلد." },
        { emoji: "🦴", name: "الجلوكوزامين", en: "Glucosamine", desc: "شائع في منتجات العناية اليومية لدعم نمط حياة نشط." },
        { emoji: "🌼", name: "أرنيكا مونتانا", en: "Arnica Montana", desc: "نبتة جبلية تُضاف لمنتجات التدليك للانتعاش." },
        { emoji: "💧", name: "الكوندرويتين", en: "Chondroitin", desc: "يُدمج عادةً مع الجلوكوزامين لتوازن أفضل." },
      ],
    },
    steps: {
      eyebrow: "طريقة الاستخدام",
      title: "أربع خطوات بسيطة كل يوم",
      subtitle: "روتين بسيط يمكن دمجه بسهولة في يومك.",
      items: [
        { title: "تنظيف المنطقة", desc: "اغسل المنطقة وجففها بلطف قبل التطبيق." },
        { title: "وضع كمية مناسبة", desc: "اضغط على المضخة ضغطة أو ضغطتين." },
        { title: "التدليك بلطف", desc: "دلك بحركات دائرية ناعمة حتى يمتصه الجلد." },
        { title: "الاستخدام المنتظم", desc: "كرر الاستعمال حسب الحاجة ضمن روتينك." },
      ],
    },
    whyus: {
      eyebrow: "لماذا نحن",
      title: "تجربة شراء تستحق ثقتك",
      subtitle: "نحرص على أن تكون تجربتك مريحة وآمنة من اللحظة الأولى.",
      items: [
        { icon: "🏆", title: "جودة عالية", desc: "منتج مصنوع وفق معايير دقيقة مع مكونات منتقاة." },
        { icon: "🚚", title: "توصيل سريع", desc: "نوصل طلبك إلى باب منزلك في جميع المحافظات." },
        { icon: "💵", title: "دفع عند الاستلام", desc: "ادفع نقداً عند الاستلام بدون مخاطر." },
        { icon: "🎧", title: "خدمة عملاء", desc: "فريق دعم جاهز للرد على استفساراتك." },
        { icon: "🔒", title: "تجربة آمنة", desc: "عملية طلب بسيطة وآمنة وحماية لبياناتك." },
      ],
    },
    faq: {
      eyebrow: "الأسئلة الشائعة",
      title: "أسئلة يطرحها عملاؤنا",
      subtitle: "كل ما تحتاج معرفته قبل الطلب.",
      items: [
        { q: "كيف أطلب المنتج؟", a: "اختر الباقة المناسبة، املأ بياناتك في نموذج الطلب، وسنتصل بك لتأكيد الطلب. الدفع عند الاستلام." },
        { q: "متى يصل الطلب؟", a: "عادةً خلال 2 إلى 5 أيام عمل حسب المحافظة." },
        { q: "هل الدفع فعلاً عند الاستلام؟", a: "نعم، تدفع نقداً عند استلام طلبك دون أي دفع مسبق." },
        { q: "هل يمكن استبدال المنتج؟", a: "نعم، نوفّر ضمان الاستبدال وفق سياسة المتجر. تواصل مع خدمة العملاء." },
        { q: "هل المكونات طبيعية؟", a: "نعم، تركيبة من مكونات طبيعية منتقاة بعناية." },
      ],
    },
  };

  // ---- Product ----
  const product = await prisma.product.upsert({
    where: { slug: "bee-venom-cream" },
    update: { content },
    create: {
      slug: "bee-venom-cream",
      name: "كريم سم النحل الطبيعي لتخفيف آلام المفاصل والعظام",
      tagline:
        "تركيبة طبيعية مختارة من سم النحل والكركم وأرنيكا، سريعة الامتصاص وغير دهنية، تدعمك في روتينك اليومي.",
      description: "كريم سم النحل الطبيعي — عناية يومية فاخرة.",
      price: 25000,
      compareAtPrice: 40000,
      currency: "IQD",
      currencySymbol: "د.ع",
      stock: 200,
      shippingFee: 5000,
      freeShippingQty: 2,
      heroBadge: "عرض اليوم: وفّر حتى 25,000 د.ع",
      rating: 4.9,
      ratingCount: 2847,
      metaTitle:
        "كريم سم النحل الطبيعي لتخفيف آلام المفاصل والعظام | عناية يومية فاخرة",
      metaDescription:
        "كريم سم النحل الطبيعي لتخفيف آلام المفاصل والعظام - مكونات طبيعية مختارة، سريع الامتصاص. دفع عند الاستلام وتوصيل سريع لكل المحافظات.",
      content,
    },
  });

  // ---- Bundles ----
  await prisma.bundle.deleteMany({ where: { productId: product.id } });
  await prisma.bundle.createMany({
    data: [
      { productId: product.id, label: "قطعة واحدة", quantity: 1, price: 25000, compareAt: 40000, position: 0 },
      { productId: product.id, label: "قطعتان", quantity: 2, price: 45000, compareAt: 80000, freeShipping: true, isPopular: true, position: 1 },
      { productId: product.id, label: "ثلاث قطع", quantity: 3, price: 60000, compareAt: 120000, freeShipping: true, position: 2 },
    ],
  });

  // ---- Upsell ----
  await prisma.upsell.deleteMany({ where: { productId: product.id } });
  await prisma.upsell.create({
    data: {
      productId: product.id,
      title: "أضف قطعة إضافية بخصم 50%",
      description:
        "بما أنك طلبت الآن، يمكنك إضافة عبوة ثانية بنصف السعر مع شحن مجاني — عرض لمرة واحدة فقط.",
      extraQuantity: 1,
      discountPercent: 50,
      freeShipping: true,
      price: 12500,
      compareAt: 25000,
      position: 0,
    },
  });

  // ---- Reviews ----
  await prisma.review.deleteMany({ where: { productId: product.id } });
  await prisma.review.createMany({
    data: [
      { productId: product.id, author: "أم محمد", location: "بغداد", rating: 5, body: "منتج رائع، لاحظت الفرق في راحتي اليومية بعد أسبوعين من الاستخدام المنتظم.", position: 0 },
      { productId: product.id, author: "أبو علي", location: "البصرة", rating: 5, body: "التوصيل كان سريع والدفع عند الاستلام مريح جداً. الكريم سريع الامتصاص وغير دهني.", position: 1 },
      { productId: product.id, author: "سارة ك.", location: "أربيل", rating: 5, body: "رائحته لطيفة ولا يترك أثر على الملابس. أنصح به بشدة.", position: 2 },
      { productId: product.id, author: "حسن ج.", location: "النجف", rating: 4, body: "جودة جيدة وخدمة عملاء متعاونة. سأطلب مرة أخرى.", position: 3 },
      { productId: product.id, author: "ريم س.", location: "كركوك", rating: 5, body: "استخدمته لوالدتي وكانت سعيدة جداً بالنتيجة. شكراً لكم.", position: 4 },
      { productId: product.id, author: "محمد ع.", location: "كربلاء", rating: 5, body: "العبوة عملية والمضخة سهلة. تجربة شراء ممتازة.", position: 5 },
    ],
  });

  console.log(`✓ product seeded: /p/${product.slug}`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
