"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { computePricing } from "@/lib/pricing";
import { orderSchema } from "@/lib/validations";
import { createOrder } from "@/server/actions/order";
import { track, getSessionId } from "@/lib/tracking";
import { formatMoney } from "@/lib/utils";
import { BundleView, ProductView } from "@/lib/funnel-types";

type ReviewView = {
  id: string;
  author: string;
  location: string | null;
  rating: number;
  body: string;
};

type FormValues = z.infer<typeof orderSchema>;

const NAV_LINKS = [
  { href: "#benefits", label: "المميزات" },
  { href: "#ingredients", label: "المكونات" },
  { href: "#reviews", label: "آراء العملاء" },
  { href: "#offer", label: "العروض" },
  { href: "#faq", label: "الأسئلة الشائعة" },
];

const TOPBAR_ITEMS = [
  "🚚 توصيل سريع لكل المحافظات",
  "💵 دفع عند الاستلام",
  "🌿 مكونات طبيعية مختارة",
  "🏆 منتج مختار بعناية",
  "🔒 طلب آمن وموثوق",
];

const PROBLEM_LIST = [
  { icon: "🦵", text: "تيبس صباحي يجعل بداية يومك أبطأ من المعتاد" },
  { icon: "🪜", text: "صعوبة في صعود الدرج أو النزول منه بحرية" },
  { icon: "🚶", text: "انزعاج أثناء المشي لمسافات طويلة" },
  { icon: "🛌", text: "تعب بعد النشاط البدني يستمر لساعات" },
  { icon: "📉", text: "تأثير تدريجي على المزاج والقدرة على ممارسة الأنشطة المحببة" },
];

const PROBLEM_CARDS = [
  { emoji: "🦵", label: "تيبس الركبة" },
  { emoji: "🪜", label: "صعوبة الدرج" },
  { emoji: "🚶", label: "ألم المشي" },
  { emoji: "🌅", label: "بداية صعبة" },
];

const SOLUTION_FEATURES = [
  {
    title: "سهل الاستخدام",
    desc: "عبوة بمضخة عملية، توزّع الكمية المناسبة بضغطة واحدة دون فوضى.",
  },
  {
    title: "سريع الامتصاص",
    desc: "يتغلغل بسرعة داخل الجلد، فلا تضطر للانتظار طويلاً قبل ارتداء ملابسك.",
  },
  {
    title: "تركيبة غير دهنية",
    desc: "خفيفة على البشرة، نظيفة على الملابس، لا تترك أثراً مزعجاً.",
  },
  {
    title: "مكونات طبيعية مختارة",
    desc: "سم النحل، الكركم، الجلوكوزامين، أرنيكا، وكوندرويتين في مزيج واحد مدروس.",
  },
];

const BENEFITS = [
  { icon: "⚡", title: "سريع الامتصاص", desc: "يتغلغل بسرعة داخل الجلد دون انتظار طويل، لتشعر بالانتعاش والراحة في وقت قصير بعد كل استعمال." },
  { icon: "✨", title: "لا يترك ملمس دهني", desc: "تركيبة خفيفة غير دهنية لا تترك أثراً على الملابس، فتستطيع المضي في يومك بأناقة وراحة تامة." },
  { icon: "🤲", title: "سهل الاستخدام", desc: "عبوة بتصميم عملي تتيح لك التحكم بالكمية بسهولة، دون فوضى أو هدر، في كل مرة تستعملها." },
  { icon: "🌞", title: "مناسب للاستخدام اليومي", desc: "تركيبة لطيفة يمكن دمجها ضمن روتينك اليومي، صباحاً ومساءً، لدعم مستمر للراحة طوال الأسبوع." },
  { icon: "🛁", title: "عبوة بمضخة عملية", desc: "مضخة محكمة توزّع الكمية المناسبة بضغطة واحدة، مع إغلاق آمن يحافظ على نشاط المكونات." },
  { icon: "🌿", title: "مكونات طبيعية مختارة", desc: "مزيج مدروس من مكونات طبيعية منتقاة بعناية، يجمع بين سم النحل والكركم وأرنيكا في تركيبة واحدة." },
];

const INGREDIENTS = [
  { emoji: "🐝", name: "سم النحل", en: "Bee Venom", desc: "مكون طبيعي قديم يُعرف بخصائصه المنشطة للبشرة، يُستخدم منذ قرون في الرعاية التقليدية لدعم الراحة اليومية." },
  { emoji: "🫚", name: "خلاصة جذور الكركم", en: "Turmeric Root", desc: "نبات معروف يستخدم على نطاق واسع في العناية التقليدية، غني بمركبات طبيعية تساعد على دعم مرونة الجلد." },
  { emoji: "🦴", name: "الجلوكوزامين", en: "Glucosamine", desc: "مادة شائعة في منتجات العناية اليومية، تُستخدم ضمن تركيبات متكاملة لدعم نمط الحياة النشط." },
  { emoji: "🌼", name: "أرنيكا مونتانا", en: "Arnica Montana", desc: "نبتة جبلية معروفة في الرعاية التقليدية، تُضاف لمنتجات التدليك لتعزيز الإحساس بالانتعاش بعد المجهود." },
  { emoji: "💧", name: "الكوندرويتين", en: "Chondroitin", desc: "مكوّن شائع في تركيبات العناية، يُدمج عادةً مع الجلوكوزامين لتحقيق توازن أفضل في التركيبة." },
];

const STEPS = [
  { title: "تنظيف المنطقة", desc: "اغسل المنطقة المراد استخدام الكريم عليها وجففها بلطف قبل التطبيق." },
  { title: "وضع كمية مناسبة", desc: "اضغط على المضخة ضغطة أو ضغطتين لتوزيع كمية مناسبة من الكريم." },
  { title: "التدليك بلطف", desc: "دلك الكريم بأطراف أصابعك بحركات دائرية ناعمة حتى يمتصه الجلد." },
  { title: "الاستخدام المنتظم", desc: "كرر الاستعمال حسب الحاجة ضمن روتينك اليومي للحصول على أفضل تجربة." },
];

const WHYUS = [
  { icon: "🏆", title: "جودة عالية", desc: "منتج مصنوع وفق معايير دقيقة مع مكونات منتقاة بعناية." },
  { icon: "🚚", title: "توصيل سريع", desc: "نوصل طلبك إلى باب منزلك في جميع المحافظات بأسرع وقت." },
  { icon: "💵", title: "دفع عند الاستلام", desc: "ادفع نقداً عند استلام طلبك، بدون أي مخاطر أو دفع مسبق." },
  { icon: "🎧", title: "خدمة عملاء", desc: "فريق دعم جاهز للرد على استفساراتك ومساعدتك في أي وقت." },
  { icon: "🔒", title: "تجربة شراء آمنة", desc: "عملية طلب بسيطة وآمنة مع حماية كاملة لبياناتك الشخصية." },
];

const FAQS = [
  { q: "هل الكريم مناسب لجميع أنواع البشرة؟", a: "الكريم مصمم ليكون لطيفاً على البشرة، لكن يُفضّل دائماً تجربة كمية صغيرة على منطقة محدودة أولاً للتأكد من ملاءمته لبشرتك. في حال ملاحظة أي احمرار أو تهيج، يُرجى التوقف عن الاستخدام." },
  { q: "كم مرة في اليوم يمكنني استخدام الكريم؟", a: "يمكن استعماله من مرة إلى مرتين يومياً حسب الحاجة، صباحاً ومساءً. الأفضل الالتزام بروتين ثابت للحصول على تجربة متكاملة ودعم مستمر للراحة اليومية." },
  { q: "هل يحتاج الكريم وصفة طبية؟", a: "لا، الكريم منتج تجميلي وعناية يومية ولا يتطلب وصفة طبية. لكن إذا كنت تعاني من حالة صحية معينة أو تتناول أدوية، يُستحسن استشارة مختص قبل بدء الاستعمال." },
  { q: "متى ألاحظ النتائج؟", a: "التجربة تختلف من شخص لآخر. الإحساس بالانتعاش يكون عادةً مباشراً بعد التدليك، أما الدعم المستمر فيأتي مع الاستعمال المنتظم ضمن روتين يومي مستمر." },
  { q: "هل يمكن استخدامه مع منتجات أخرى؟", a: "نعم، يمكن دمجه ضمن روتينك اليومي. يُنصح بتطبيقه على بشرة نظيفة وانتظار امتصاصه بالكامل قبل وضع أي منتج آخر فوقه." },
  { q: "كم تكفي العبوة الواحدة؟", a: "العبوة وزنها 50 غرام، وتكفي لعدة أسابيع من الاستعمال اليومي حسب الكمية المستخدمة في كل مرة والمناطق المطبقة عليها." },
  { q: "هل التوصيل متاح لكل المحافظات؟", a: "نعم، نوفّر التوصيل إلى جميع المحافظات العراقية. مدة التوصيل تتراوح عادةً بين 24 إلى 72 ساعة حسب موقعك." },
  { q: "هل الدفع يتم عند الاستلام؟", a: "نعم، الدفع يكون نقداً عند استلام الطلب من المندوب. لا حاجة لأي دفع مسبق، وتشمل الأسعار المعروضة رسوم التوصيل." },
  { q: "هل يمكنني إرجاع المنتج؟", a: "إذا وصل المنتج تالفاً أو مختلفاً عن الطلب، يمكنك رفض الاستلام أو التواصل مع خدمة العملاء فوراً لحل المشكلة بأسرع وقت." },
  { q: "هل الكريم آمن لكبار السن؟", a: "الكريم مناسب للاستعمال اليومي للكبار والصغار. لكن يُنصح كبار السن باستشارة مختص في حال وجود حساسية معروفة تجاه أي من المكونات." },
  { q: "هل يوجد عرض خاص عند طلب أكثر من عبوة؟", a: "نعم، لدينا عروض توفير عند طلب عبوتين أو ثلاث. كلما زاد عدد العبوات، زاد التوفير. يمكنك الاطلاع على الباقات المتوفرة في قسم العروض." },
];

function Reveal({
  as: Tag = "div",
  className,
  children,
}: {
  as?: "div" | "article";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setShown(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const cls = `${className ?? ""} ${shown ? "in" : ""}`.trim();
  if (Tag === "article") {
    return (
      <article ref={ref as React.RefObject<HTMLDivElement>} className={cls} data-reveal>
        {children}
      </article>
    );
  }
  return (
    <div ref={ref} className={cls} data-reveal>
      {children}
    </div>
  );
}

function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 70;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function LandingClient({
  storeName,
  brandEmoji,
  product,
  bundles,
  provinces,
  reviews,
  rating,
  ratingCount,
  hasUpsell,
  tagline,
  heroBadge,
  heroImage,
  solutionImage,
  stockLeft,
  disclaimer,
}: {
  storeName: string;
  brandEmoji: string;
  product: ProductView;
  bundles: BundleView[];
  provinces: string[];
  reviews: ReviewView[];
  rating: number;
  ratingCount: number;
  hasUpsell: boolean;
  tagline: string | null;
  heroBadge: string | null;
  heroImage?: string;
  solutionImage?: string;
  stockLeft: number;
  disclaimer: string;
}) {
  const router = useRouter();

  // ----- pricing / bundle selection -----
  const defaultBundleId =
    bundles.find((b) => b.isPopular)?.id ?? bundles[0]?.id ?? null;
  const [selectedBundleId, setSelectedBundleId] = useState<string | null>(
    defaultBundleId,
  );
  const [quantity, setQuantity] = useState(bundles[0]?.quantity ?? 1);
  const [checkoutStarted, setCheckoutStarted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const selectedBundle = bundles.find((b) => b.id === selectedBundleId) ?? null;
  const pricing = useMemo(
    () => computePricing(product, quantity, selectedBundle),
    [product, quantity, selectedBundle],
  );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      productId: product.id,
      quantity: 1,
      fullName: "",
      phone: "",
      province: "",
      city: "",
      address: "",
    },
  });

  const startCheckout = useCallback(() => {
    if (!checkoutStarted) {
      setCheckoutStarted(true);
      track("INITIATE_CHECKOUT", {
        productId: product.id,
        value: pricing.total,
        contentName: product.name,
      });
    }
  }, [checkoutStarted, pricing.total, product.id, product.name]);

  const selectBundle = (id: string) => {
    setSelectedBundleId(id);
    const b = bundles.find((x) => x.id === id);
    track("ADD_TO_CART", {
      productId: product.id,
      value: b?.price ?? product.price,
      contentName: product.name,
    });
  };

  const choosePackageAndScroll = (id: string) => {
    selectBundle(id);
    scrollToId("order");
  };

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    const payload = {
      ...values,
      productId: product.id,
      bundleId: selectedBundle?.id ?? null,
      quantity: pricing.quantity,
      source:
        new URLSearchParams(window.location.search).get("utm_source") ??
        "landing",
      sessionId: getSessionId(),
    };
    const res = await createOrder(payload);
    if (!res.ok) {
      if (res.fieldErrors) {
        for (const [k, v] of Object.entries(res.fieldErrors)) {
          setError(k as keyof FormValues, { message: v });
        }
      }
      setServerError(res.error);
      return;
    }
    track("ORDER_SUBMITTED", {
      productId: product.id,
      orderId: res.orderId,
      value: res.total,
      province: values.province,
    });
    track("PURCHASE", {
      productId: product.id,
      orderId: res.orderId,
      value: res.total,
      province: values.province,
    });
    router.push(
      hasUpsell ? `/upsell/${res.orderId}` : `/thank-you/${res.orderId}`,
    );
  };

  // ----- floating button visibility -----
  const [showFloating, setShowFloating] = useState(false);
  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const hero = document.getElementById("hero");
      const order = document.getElementById("offer");
      const finalCta = document.getElementById("final-cta");
      const winH = window.innerHeight;
      const heroRect = hero?.getBoundingClientRect();
      const orderRect = order?.getBoundingClientRect();
      const finalRect = finalCta?.getBoundingClientRect();
      const scrolledEnough = heroRect ? heroRect.bottom < winH * 0.4 : false;
      const inOrder = orderRect
        ? orderRect.top < winH * 0.85 && orderRect.bottom > winH * 0.15
        : false;
      const inFinal = finalRect
        ? finalRect.top < winH * 0.5 && finalRect.bottom > 0
        : false;
      setShowFloating(scrolledEnough && !inOrder && !inFinal);
    };
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.classList.toggle("has-floating-cta", showFloating);
  }, [showFloating]);

  // ----- countdown -----
  const [cd, setCd] = useState({ d: "00", h: "00", m: "00", s: "00" });
  useEffect(() => {
    const KEY = "cod_deadline_v1";
    const pad = (n: number) => (n < 10 ? "0" + n : "" + n);
    let deadline = Number(localStorage.getItem(KEY) ?? 0);
    const now = Date.now();
    if (!deadline || deadline < now) {
      deadline =
        now + 3 * 24 * 60 * 60 * 1000 + 7 * 60 * 60 * 1000 + 42 * 60 * 1000;
      localStorage.setItem(KEY, String(deadline));
    }
    const tick = () => {
      let diff = deadline - Date.now();
      if (diff <= 0) {
        deadline = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem(KEY, String(deadline));
        diff = deadline - Date.now();
      }
      setCd({
        d: pad(Math.floor(diff / (24 * 60 * 60 * 1000))),
        h: pad(Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))),
        m: pad(Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))),
        s: pad(Math.floor((diff % (60 * 1000)) / 1000)),
      });
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  // ----- FAQ -----
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // ----- reviews slider -----
  const trackRef = useRef<HTMLDivElement>(null);
  const [perView, setPerView] = useState(1);
  const [current, setCurrent] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);
  const reviewData = reviews.length > 0 ? reviews : [];
  const pages = Math.max(1, reviewData.length - perView + 1);

  useEffect(() => {
    const calc = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
      setCurrent(0);
      const card = trackRef.current?.children[0] as HTMLElement | undefined;
      setCardWidth(card?.offsetWidth ?? 0);
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  useEffect(() => {
    if (reviewData.length === 0) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1 > pages - 1 ? 0 : c + 1));
    }, 5500);
    return () => window.clearInterval(id);
  }, [pages, reviewData.length]);

  const trackTransform = `translateX(${(cardWidth + 20) * current}px)`;

  const goTo = (i: number) => setCurrent(Math.max(0, Math.min(pages - 1, i)));

  const money = (n: number) => formatMoney(n, product.currencySymbol);
  const floatingSub = selectedBundle
    ? `${money(selectedBundle.price)} · ${selectedBundle.label}`
    : money(product.price);

  return (
    <div className="lp" ref={rootRef}>
      {/* TOP BAR */}
      <div className="topbar" role="banner">
        <div className="topbar-track">
          {[...TOPBAR_ITEMS, ...TOPBAR_ITEMS].map((t, i) => (
            <span className="topbar-item" key={i}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* HEADER */}
      <header className="header">
        <div className="container header-inner">
          <a
            href="#hero"
            className="brand"
            onClick={(e) => {
              e.preventDefault();
              scrollToId("hero");
            }}
          >
            <span className="brand-logo">{brandEmoji}</span>
            <span>{storeName}</span>
          </a>
          <nav className="header-nav" aria-label="القائمة الرئيسية">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.href.slice(1));
                }}
              >
                {l.label}
              </a>
            ))}
          </nav>
          <div className="header-cta">
            <a
              href="#order"
              className="btn btn-primary"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("order");
              }}
            >
              اطلب الآن
            </a>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
        <section className="hero" id="hero">
          <div className="container hero-grid">
            <div className="hero-content">
              {heroBadge && (
                <div className="hero-badge">
                  <span className="dot" />
                  <span>{heroBadge}</span>
                </div>
              )}
              <h1>{product.name}</h1>
              {tagline && <p className="hero-sub">{tagline}</p>}
              <div className="hero-rating">
                <span className="hero-stars">★★★★★</span>
                <span className="hero-rating-text">
                  {rating.toFixed(1)} من 5
                </span>
                <span className="hero-rating-count">
                  · {ratingCount.toLocaleString("ar-IQ")} تقييم
                </span>
              </div>
              <div className="hero-cta-row">
                <a
                  href="#offer"
                  className="btn btn-primary btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("offer");
                  }}
                >
                  اطلب الآن وادفع عند الاستلام
                </a>
                <a
                  href="#benefits"
                  className="btn btn-secondary btn-lg"
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToId("benefits");
                  }}
                >
                  اكتشف المميزات
                </a>
              </div>
              <div className="hero-trust">
                <span className="trust-pill">🚚 توصيل سريع</span>
                <span className="trust-pill">💵 دفع عند الاستلام</span>
                <span className="trust-pill">🌿 مكونات طبيعية</span>
                <span className="trust-pill">🔒 طلب آمن</span>
              </div>
            </div>
            <div className="hero-image-wrap">
              {heroImage ? (
                <Image
                  src={heroImage}
                  alt={product.name}
                  width={480}
                  height={480}
                  priority
                  className="hero-image"
                />
              ) : (
                <div
                  className="hero-image"
                  style={{
                    aspectRatio: "1/1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 120,
                    background:
                      "linear-gradient(135deg,var(--honey-light),var(--gold))",
                  }}
                >
                  {brandEmoji}
                </div>
              )}
              <div className="hero-image-badge top">
                <span className="icon">🌿</span>
                <span>طبيعي 100%</span>
              </div>
              <div className="hero-image-badge bottom">
                <span className="icon">📦</span>
                <span>عبوة عملية</span>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM */}
        <section className="section problem" id="problem">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">المشكلة</span>
              <h2 className="section-title">
                حين تصبح <span className="accent">الحركة اليومية</span> صعبة...
              </h2>
              <p className="section-sub">
                كثير منا يوصل لمرحلة يحس فيها أن جسمه ما عاد يتحرك بنفس الخفة. هذا
                الإحساس شائع، لكن هذا لا يعني إنه لازم نتعايش معه بدون ما نسوي شي.
              </p>
            </div>
            <div className="problem-grid">
              <div className="problem-text">
                <blockquote className="problem-quote">
                  «صرت ألاحظ أن صعود الدرج ما عاد سهل مثل قبل. التيبس الصباحي
                  يرافقني كل يوم، والمشي لمسافات طويلة صار متعب.»
                </blockquote>
                <p>
                  هذه ليست حالة واحدة، بل شي يعاني منه كثير من الناس فوق سن الـ35.
                  عدم الراحة في الركبة، التعب بعد أي نشاط بسيط، والتيبس عند
                  الاستيقاظ... كلها إشارات تأثر على يومك كامل.
                </p>
                <ul className="problem-list">
                  {PROBLEM_LIST.map((p, i) => (
                    <li key={i}>
                      <span className="icon">{p.icon}</span>
                      <span>{p.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="problem-visual">
                <div className="problem-emoji-block">
                  {PROBLEM_CARDS.map((c, i) => (
                    <div className="problem-emoji-card" key={i}>
                      <div className="emoji">{c.emoji}</div>
                      <div className="label">{c.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section className="section solution" id="solution">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">الحل</span>
              <h2 className="section-title">
                الحل الطبيعي اللي يدخل بسهولة في{" "}
                <span className="accent">روتينك اليومي</span>
              </h2>
              <p className="section-sub">
                {storeName} يجمع مكونات مختارة بعناية في تركيبة واحدة عملية،
                مصممة تساعدك في كل خطوة من يومك.
              </p>
            </div>
            <div className="solution-grid">
              <div className="solution-image-wrap">
                {solutionImage ? (
                  <Image
                    src={solutionImage}
                    alt={product.name}
                    width={380}
                    height={380}
                    className="solution-image"
                  />
                ) : (
                  <div
                    className="solution-image"
                    style={{
                      aspectRatio: "1/1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 96,
                      background:
                        "linear-gradient(135deg,var(--honey-light),var(--gold))",
                    }}
                  >
                    {brandEmoji}
                  </div>
                )}
                <span className="solution-deco d1">🐝</span>
                <span className="solution-deco d2">🌿</span>
              </div>
              <div className="solution-text">
                <h3 style={{ fontSize: 24, marginBottom: 14 }}>
                  منتج مصمم يناسب حياتك اليومية
                </h3>
                <p style={{ color: "var(--brown-soft)", marginBottom: 18 }}>
                  مو كل المنتجات تدخل بسهولة في روتينك اليومي. تركيبته خفيفة،
                  ريحته لطيفة، وتستعمله بدقائق بسيطة بدون ما يضيف عليك أي عبء.
                </p>
                <div className="solution-features">
                  {SOLUTION_FEATURES.map((f, i) => (
                    <div className="solution-feature" key={i}>
                      <span className="check">✓</span>
                      <span className="text">
                        <strong>{f.title}</strong>
                        {f.desc}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="section benefits" id="benefits">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">المميزات</span>
              <h2 className="section-title">
                لماذا يختار العملاء{" "}
                <span className="accent">{storeName}</span>؟
              </h2>
              <p className="section-sub">
                ست مزايا تجعل من هذا المنتج خياراً عملياً ومدروساً لدعم راحتك
                اليومية.
              </p>
            </div>
            <div className="benefits-grid">
              {BENEFITS.map((b, i) => (
                <Reveal className="benefit-card glass" key={i}>
                  <div className="benefit-icon">{b.icon}</div>
                  <h3 className="benefit-title">{b.title}</h3>
                  <p className="benefit-desc">{b.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* INGREDIENTS */}
        <section className="section ingredients" id="ingredients">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">المكونات</span>
              <h2 className="section-title">
                مكونات طبيعية <span className="accent">منتقاة بعناية</span>
              </h2>
              <p className="section-sub">
                مزيج من خمسة مكونات طبيعية معروفة في الرعاية التقليدية، مدروسة
                بدقة لتعمل معاً في تركيبة واحدة.
              </p>
            </div>
            <div className="ingredients-grid">
              {INGREDIENTS.map((ing, i) => (
                <Reveal className="ingredient-card glass" key={i}>
                  <div className="ingredient-emoji">{ing.emoji}</div>
                  <div className="ingredient-name">{ing.name}</div>
                  <div className="ingredient-en">{ing.en}</div>
                  <p className="ingredient-desc">{ing.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW TO USE */}
        <section className="section howto" id="howto">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">طريقة الاستخدام</span>
              <h2 className="section-title">
                أربع خطوات <span className="accent">بسيطة</span> كل يوم
              </h2>
              <p className="section-sub">
                لا حاجة لتعقيد الأمور. روتين بسيط من أربع خطوات يمكن دمجه بسهولة
                في يومك.
              </p>
            </div>
            <div className="steps-grid">
              {STEPS.map((s, i) => (
                <Reveal className="step-card" key={i}>
                  <div className="step-num">{i + 1}</div>
                  <div className="step-content">
                    <h3 className="step-title">{s.title}</h3>
                    <p className="step-desc">{s.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="section whyus" id="whyus">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">لماذا نحن</span>
              <h2 className="section-title">
                تجربة شراء <span className="accent">تستحق ثقتك</span>
              </h2>
              <p className="section-sub">
                نحرص على أن تكون تجربتك معنا مريحة وآمنة من اللحظة الأولى حتى
                استلام طلبك.
              </p>
            </div>
            <div className="whyus-grid">
              {WHYUS.map((w, i) => (
                <Reveal className="why-card glass" key={i}>
                  <div className="why-icon">{w.icon}</div>
                  <h3 className="why-title">{w.title}</h3>
                  <p className="why-desc">{w.desc}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* REVIEWS */}
        {reviewData.length > 0 && (
          <section className="section reviews" id="reviews">
            <div className="container">
              <div className="section-head">
                <span className="section-eyebrow">آراء العملاء</span>
                <h2 className="section-title">
                  ماذا قال <span className="accent">عملاؤنا</span>؟
                </h2>
                <p className="section-sub">
                  تجارب حقيقية من عملاء في مختلف المحافظات.
                </p>
              </div>

              <div className="reviews-summary">
                <div>
                  <div className="big-rating">{rating.toFixed(1)}</div>
                  <div className="stars">★★★★★</div>
                </div>
                <div className="divider" />
                <div className="count">
                  {ratingCount.toLocaleString("ar-IQ")} تقييم موثوق
                  <br />
                  من عملاء سعداء
                </div>
                <div className="divider" />
                <div className="count">
                  98%
                  <br />
                  يوصون به لغيرهم
                </div>
              </div>

              <div className="reviews-slider">
                <div
                  className="reviews-track"
                  ref={trackRef}
                  style={{ transform: trackTransform }}
                >
                  {reviewData.map((r) => (
                    <article className="review-card" key={r.id}>
                      <div className="review-head">
                        <div className="review-avatar">
                          {r.author.trim().charAt(0)}
                        </div>
                        <div className="review-meta">
                          <div className="review-name">{r.author}</div>
                          {r.location && (
                            <div className="review-info">{r.location}</div>
                          )}
                        </div>
                        <div className="review-stars">
                          {"★".repeat(Math.max(1, Math.min(5, r.rating)))}
                          {"☆".repeat(5 - Math.max(1, Math.min(5, r.rating)))}
                        </div>
                      </div>
                      <p className="review-text">{r.body}</p>
                      <div className="review-badge">✓ عملية شراء موثّقة</div>
                    </article>
                  ))}
                </div>
              </div>
              {pages > 1 && (
                <div className="reviews-nav">
                  <button
                    className="reviews-btn"
                    aria-label="السابق"
                    onClick={() => goTo(current - 1)}
                  >
                    ›
                  </button>
                  <div className="reviews-dots">
                    {Array.from({ length: pages }).map((_, i) => (
                      <span
                        key={i}
                        className={"reviews-dot" + (i === current ? " active" : "")}
                        onClick={() => goTo(i)}
                      />
                    ))}
                  </div>
                  <button
                    className="reviews-btn"
                    aria-label="التالي"
                    onClick={() => goTo(current + 1)}
                  >
                    ‹
                  </button>
                </div>
              )}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="section faq" id="faq">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">الأسئلة الشائعة</span>
              <h2 className="section-title">
                أسئلة قد <span className="accent">تشغل بالك</span>
              </h2>
              <p className="section-sub">
                جمعنا لك أكثر الأسئلة شيوعاً التي يطرحها عملاؤنا قبل اتخاذ قرار
                الطلب.
              </p>
            </div>
            <div className="faq-list">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div className={"faq-item" + (open ? " open" : "")} key={i}>
                    <button
                      className="faq-q"
                      aria-expanded={open}
                      onClick={() => setOpenFaq(open ? null : i)}
                    >
                      <span>{f.q}</span>
                      <span className="faq-icon">+</span>
                    </button>
                    <div
                      className="faq-a"
                      style={{ maxHeight: open ? 400 : 0 }}
                    >
                      <p>{f.a}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* OFFER / PRICING */}
        <section className="section offer" id="offer">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">العروض</span>
              <h2 className="section-title">
                اختر الباقة <span className="accent">المناسبة لك</span>
              </h2>
              <p className="section-sub">
                كلما زاد عدد العبوات، زاد توفيرك. جميع الأسعار تشمل التوصيل والدفع
                عند الاستلام.
              </p>
            </div>
            <div className="offer-grid">
              {bundles.map((b) => {
                const base = product.price * b.quantity;
                const save = Math.max(0, (b.compareAt ?? base) - b.price);
                const perUnit = Math.round(b.price / b.quantity);
                const selected = b.id === selectedBundleId;
                return (
                  <div
                    key={b.id}
                    className={
                      "price-card" +
                      (b.isPopular ? " popular" : "") +
                      (selected ? " selected" : "")
                    }
                    onClick={() => selectBundle(b.id)}
                  >
                    {b.isPopular && (
                      <div className="price-badge">الأكثر طلباً</div>
                    )}
                    <div className="price-qty">{b.label}</div>
                    <div className="price-icons">
                      {"📦".repeat(Math.min(3, b.quantity))}
                    </div>
                    <div className="price-amount">
                      <span className="price-value">
                        {b.price.toLocaleString("ar-IQ")}
                      </span>
                      <span className="price-currency">
                        {product.currencySymbol}
                      </span>
                    </div>
                    <div className={"price-save" + (save > 0 ? "" : " placeholder")}>
                      {save > 0 ? `وفّر ${money(save)}` : "\u00A0"}
                    </div>
                    <div className="price-per">
                      {perUnit.toLocaleString("ar-IQ")} {product.currencySymbol}{" "}
                      للعبوة
                    </div>
                    <div className="price-delivery">
                      {b.freeShipping ? "🚚 توصيل مجاني" : "🚚 تشمل التوصيل"}
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary price-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        choosePackageAndScroll(b.id);
                      }}
                    >
                      اطلب الآن
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* UPSELL PREVIEW */}
        {bundles.length > 0 && (
          <section className="section upsell" id="upsell">
            <div className="container">
              <div className="section-head">
                <span className="section-eyebrow">قيمة أكبر</span>
                <h2 className="section-title">
                  احصل على <span className="accent">قيمة أكبر</span> ووفّر أكثر
                </h2>
                <p className="section-sub">
                  لا تنتظر حتى تنفد العبوة لتطلب من جديد. اطلب كمية أكبر الآن
                  واستمتع بتوفير حقيقي وفترة استخدام أطول دون انقطاع.
                </p>
              </div>
              <div className="upsell-grid">
                {bundles.map((b, idx) => {
                  const base = product.price * b.quantity;
                  const save = Math.max(0, (b.compareAt ?? base) - b.price);
                  return (
                    <div
                      className={"upsell-card" + (b.isPopular ? " featured" : "")}
                      key={b.id}
                    >
                      <div className="emoji-row">
                        {"📦".repeat(Math.min(3, b.quantity))}
                      </div>
                      <div className="qty">{b.label}</div>
                      <div className="duration">
                        يكفي لـ {b.quantity * 3}-{b.quantity * 4} أسابيع
                      </div>
                      <div className="price">{money(b.price)}</div>
                      <div className="saving">
                        {save > 0 ? `وفّر ${money(save)}` : "السعر الأساسي"}
                      </div>
                      <ul className="benefits-list">
                        <li>
                          <span className="check">✓</span>
                          <span>
                            {idx === 0
                              ? "مناسب للتجربة الأولى"
                              : "أفضل قيمة مقابل السعر"}
                          </span>
                        </li>
                        <li>
                          <span className="check">✓</span>
                          <span>
                            {b.freeShipping ? "توصيل مجاني" : "يشمل التوصيل"}
                          </span>
                        </li>
                        <li>
                          <span className="check">✓</span>
                          <span>دفع عند الاستلام</span>
                        </li>
                      </ul>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => choosePackageAndScroll(b.id)}
                      >
                        اختيار هذه الباقة
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SCARCITY */}
        <section className="scarcity" id="scarcity">
          <div className="container scarcity-inner">
            <div className="scarcity-badge">
              <span>⏰</span>
              <span>العرض ينتهي قريباً</span>
            </div>
            <h2>الكمية محدودة... الطلب مرتفع جداً</h2>
            <p>
              بسبب الإقبال الكبير، تبقى كميات محدودة من هذه الدفعة. اطلب الآن قبل
              نفاد الكمية.
            </p>
            <div className="countdown">
              <div className="countdown-block">
                <div className="countdown-num">{cd.d}</div>
                <div className="countdown-label">يوم</div>
              </div>
              <div className="countdown-block">
                <div className="countdown-num">{cd.h}</div>
                <div className="countdown-label">ساعة</div>
              </div>
              <div className="countdown-block">
                <div className="countdown-num">{cd.m}</div>
                <div className="countdown-label">دقيقة</div>
              </div>
              <div className="countdown-block">
                <div className="countdown-num">{cd.s}</div>
                <div className="countdown-label">ثانية</div>
              </div>
            </div>
            <div className="scarcity-stock">
              <span>🔥 تبقى {stockLeft} عبوة فقط من هذه الدفعة</span>
            </div>
            <div className="stock-bar">
              <div className="stock-bar-fill" />
            </div>
          </div>
        </section>

        {/* ORDER FORM */}
        <section className="section order" id="order-section">
          <div className="container">
            <div className="section-head">
              <span className="section-eyebrow">أكمل طلبك</span>
              <h2 className="section-title">
                اطلب الآن وادفع <span className="accent">عند الاستلام</span>
              </h2>
              <p className="section-sub">
                املأ النموذج التالي وسيتواصل معك فريقنا لتأكيد الطلب. لا حاجة لأي
                دفع مسبق.
              </p>
            </div>

            <div className="order-form-wrap" id="order">
              <div className="form-head">
                <h3>نموذج الطلب السريع</h3>
                <p>يستغرق أقل من دقيقة · آمن وموثوق · دفع عند الاستلام</p>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                onFocus={startCheckout}
                noValidate
              >
                {bundles.length > 0 && (
                  <div className="form-field" style={{ marginBottom: 16 }}>
                    <label>اختر الباقة</label>
                    <div className="qty-selector">
                      {bundles.map((b) => (
                        <label className="qty-option" key={b.id}>
                          <input
                            type="radio"
                            name="bundle"
                            checked={selectedBundleId === b.id}
                            onChange={() => selectBundle(b.id)}
                          />
                          <span className="qty-label">
                            <span className="q">{b.quantity}</span>
                            <span className="p">{money(b.price)}</span>
                            {b.compareAt && b.compareAt > b.price && (
                              <span className="save">
                                وفّر {money(b.compareAt - b.price)}
                              </span>
                            )}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {bundles.length === 0 && (
                  <div className="form-field" style={{ marginBottom: 16 }}>
                    <label>الكمية</label>
                    <div className="qty-selector">
                      {[1, 2, 3].map((q) => (
                        <label className="qty-option" key={q}>
                          <input
                            type="radio"
                            name="qty"
                            checked={quantity === q}
                            onChange={() => setQuantity(q)}
                          />
                          <span className="qty-label">
                            <span className="q">{q}</span>
                            <span className="p">
                              {money(product.price * q)}
                            </span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                <div className="form-row">
                  <div className={"form-field" + (errors.fullName ? " error" : "")}>
                    <label htmlFor="fullName">
                      الاسم الكامل <span className="req">*</span>
                    </label>
                    <input
                      id="fullName"
                      {...register("fullName")}
                      placeholder="مثال: أحمد محمد"
                      autoComplete="name"
                    />
                    {errors.fullName && (
                      <span className="error-msg">{errors.fullName.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-row">
                  <div className={"form-field" + (errors.phone ? " error" : "")}>
                    <label htmlFor="phone">
                      رقم الهاتف <span className="req">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      inputMode="tel"
                      {...register("phone")}
                      placeholder="07XXXXXXXXX"
                      autoComplete="tel"
                    />
                    {errors.phone && (
                      <span className="error-msg">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div className="form-row two-col">
                  <div className={"form-field" + (errors.province ? " error" : "")}>
                    <label htmlFor="province">
                      المحافظة <span className="req">*</span>
                    </label>
                    <select
                      id="province"
                      {...register("province")}
                      defaultValue=""
                    >
                      <option value="" disabled>
                        اختر المحافظة
                      </option>
                      {provinces.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                    {errors.province && (
                      <span className="error-msg">
                        {errors.province.message}
                      </span>
                    )}
                  </div>
                  <div className="form-field">
                    <label htmlFor="city">المدينة / القضاء</label>
                    <input id="city" {...register("city")} placeholder="اختياري" />
                  </div>
                </div>

                <div className="form-row">
                  <div className={"form-field" + (errors.address ? " error" : "")}>
                    <label htmlFor="address">
                      العنوان بالتفصيل <span className="req">*</span>
                    </label>
                    <textarea
                      id="address"
                      {...register("address")}
                      placeholder="الحي، أقرب نقطة دالة، تفاصيل إضافية للتوصيل"
                    />
                    {errors.address && (
                      <span className="error-msg">{errors.address.message}</span>
                    )}
                  </div>
                </div>

                {/* ORDER SUMMARY */}
                <div className="order-summary">
                  <div className="order-summary-row">
                    <span className="label">
                      المنتج ({pricing.quantity} قطعة)
                    </span>
                    <span className="value">{money(pricing.subtotal)}</span>
                  </div>
                  {pricing.discount > 0 && (
                    <div className="order-summary-row">
                      <span className="label">الخصم</span>
                      <span className="value" style={{ color: "var(--green)" }}>
                        -{money(pricing.discount)}
                      </span>
                    </div>
                  )}
                  <div className="order-summary-row">
                    <span className="label">التوصيل</span>
                    <span className="value">
                      {pricing.shipping === 0 ? "مجاني" : money(pricing.shipping)}
                    </span>
                  </div>
                  <div className="order-summary-row total">
                    <span>الإجمالي</span>
                    <span className="value">{money(pricing.total)}</span>
                  </div>
                </div>

                <div className="form-trust">
                  <span className="form-trust-item">🔒 طلب آمن</span>
                  <span className="form-trust-item">💵 دفع عند الاستلام</span>
                  <span className="form-trust-item">🚚 توصيل سريع</span>
                  <span className="form-trust-item">📞 تأكيد فوري</span>
                </div>

                {serverError && (
                  <div className="form-server-error">{serverError}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary btn-block btn-lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "جارٍ إرسال الطلب..."
                    : "✅ تأكيد الطلب — دفع عند الاستلام"}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="final-cta" id="final-cta">
          <div className="container final-cta-inner">
            <h2>
              لا تؤجل <span className="accent">راحتك</span> ليوم آخر
            </h2>
            <p>
              كل يوم يمر دون أن تعتني بنفسك هو يوم لن يعود. ابدأ اليوم رحلتك نحو
              حركة أسهل، صباحات أخف، ونشاط يومي أكبر. طلبك على بُعد خطوة واحدة فقط.
            </p>
            <a
              href="#order"
              className="btn btn-primary btn-lg"
              onClick={(e) => {
                e.preventDefault();
                scrollToId("order");
              }}
            >
              اطلب الآن وادفع عند الاستلام
            </a>
            <div className="final-cta-trust">
              <span>🚚 توصيل لكل المحافظات</span>
              <span>💵 دفع عند الاستلام</span>
              <span>🌿 مكونات طبيعية</span>
              <span>🔒 طلب آمن</span>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-brand">
            {brandEmoji} {storeName}
          </div>
          <div className="footer-links">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(l.href.slice(1));
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
          <div className="footer-disclaimer">{disclaimer}</div>
        </div>
      </footer>

      {/* FLOATING ORDER BTN */}
      <button
        className={"floating-btn" + (showFloating ? " show" : "")}
        aria-label="اطلب الآن"
        onClick={() => scrollToId("order")}
      >
        <span className="fb-pulse" aria-hidden="true" />
        <span className="fb-icon">🛒</span>
        <span className="fb-text">
          <span className="fb-main">اطلب الآن</span>
          <span className="fb-sub">{floatingSub}</span>
        </span>
      </button>
    </div>
  );
}
