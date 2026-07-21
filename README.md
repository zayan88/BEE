# COD Funnel — نظام قمع مبيعات الدفع عند الاستلام

منصة صفحات هبوط عربية (RTL) للدفع عند الاستلام مبنية على **Next.js 15 (App Router)** مع لوحة تحكم كاملة لإدارة المنتجات والطلبات والعروض الإضافية (Upsell) والتتبع والتحليلات.

## المزايا

- 🛍️ **صفحة هبوط تسويقية** عربية RTL محسّنة للتحويل (هيرو، المشكلة/الحل، المميزات، المكونات، خطوات الاستخدام، آراء العملاء، الأسئلة الشائعة، عرض الباقات، نموذج الطلب، شريط CTA ثابت للجوال).
- 🧾 **نموذج طلب مخصص** (React Hook Form + Zod): الاسم، الهاتف، المحافظة، المدينة، العنوان، محدّد الكمية، اختيار الباقة، تسعير وشحن ديناميكي، حساب الخصومات، ملخص الطلب.
- ⚡ **نظام Upsell بنقرة واحدة** بعد إتمام الطلب مع تتبع معدل القبول.
- 📊 **لوحة تحكم إدارية**: نظرة عامة، الطلبات، المنتجات، العملاء، التحليلات، مركز التتبع، الإعدادات.
- 🎯 **مركز تتبع**: Meta Pixel، TikTok Pixel، Google Analytics، Google Tag Manager، Snapchat Pixel، وسكربتات مخصصة — تُحقن تلقائياً في صفحات المتجر.
- 📈 **تتبع أحداث**: PageView, ViewContent, AddToCart, InitiateCheckout, Lead, Purchase, UpsellAccepted, UpsellRejected, OrderSubmitted (طرف أول + البكسلات).
- 🔍 **SEO**: ميتا ديناميكي، Open Graph، Twitter Cards، JSON-LD (Product/Offer/AggregateRating)، `sitemap.xml`، `robots.txt`.
- 🔐 **الأمان**: مصادقة NextAuth (Credentials + bcrypt)، حماية مسارات `/admin` عبر middleware، تحقق Zod، Rate limiting، Server Actions.

## المكدس التقني

| الطبقة | التقنية |
|--------|---------|
| الإطار | Next.js 15 (App Router) |
| اللغة | TypeScript |
| التنسيق | Tailwind CSS v4 |
| المكوّنات | Shadcn-style + Radix |
| قاعدة البيانات | PostgreSQL |
| ORM | Prisma |
| المصادقة | NextAuth (Credentials) |
| النماذج | React Hook Form + Zod |
| الرسوم البيانية | Recharts |

## بنية المشروع

```
prisma/
  schema.prisma          # مخطط قاعدة البيانات الكامل
  seed.ts                # بيانات أولية (منتج كريم سم النحل + مشرف + إعدادات)
src/
  app/
    (site)/              # واجهة المتجر العامة
      layout.tsx         #   يحقن البكسلات + تتبع مشاهدات الصفحة
      page.tsx           #   الرئيسية (تحويل لصفحة المنتج للمتجر أحادي المنتج)
      p/[slug]/          #   صفحة هبوط المنتج (قمع كامل + JSON-LD)
      upsell/[orderId]/  #   صفحة العرض الإضافي بعد الطلب
      thank-you/[orderId]/ # صفحة تأكيد الطلب
    admin/               # لوحة التحكم (محمية)
      page.tsx           #   نظرة عامة
      orders/ products/ customers/ analytics/ tracking/ settings/
    login/               # تسجيل دخول المشرف
    api/
      auth/[...nextauth]/  # NextAuth
      track/               # استقبال أحداث التتبع (طرف أول)
    sitemap.ts  robots.ts
  components/
    landing/   # مكوّنات صفحة الهبوط
    admin/     # مكوّنات لوحة التحكم
    tracking/  # PixelScripts / PageViewTracker / ViewContentTracker
    ui/        # مكوّنات Shadcn-style
  lib/         # prisma, auth, pricing, analytics, validations, tracking, utils…
  server/actions/  # Server Actions (order.ts, admin.ts)
  middleware.ts    # حماية /admin
```

## قاعدة البيانات

النماذج الأساسية: `User`, `Product`, `ProductImage`, `Variant`, `Bundle`, `Offer`, `Upsell`, `UpsellEvent`, `Customer`, `Order`, `OrderItem`, `Review`, `TrackingSettings`, `AnalyticsEvent`, `SiteSettings`.

> المبالغ المالية تُخزّن كأعداد صحيحة بأصغر وحدة للعملة (دينار عراقي).

## متغيرات البيئة

انسخ `.env.example` إلى `.env` واملأ القيم:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DBNAME?schema=public"
NEXTAUTH_SECRET="<openssl rand -base64 32>"
NEXTAUTH_URL="https://your-domain.com"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="change-this-strong-password"
```

## التشغيل محلياً

```bash
# 1) التبعيات
npm install

# 2) قاعدة بيانات PostgreSQL (مثال عبر Docker)
docker run --name codpg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=codfunnel -p 5432:5432 -d postgres:16-alpine

# 3) الجداول + البيانات الأولية
npm run db:migrate      # أو: npx prisma migrate deploy
npm run db:seed

# 4) التشغيل
npm run dev             # http://localhost:3000
```

- المتجر: `http://localhost:3000/p/bee-venom-cream`
- لوحة التحكم: `http://localhost:3000/admin` (سجّل الدخول بـ `ADMIN_EMAIL` / `ADMIN_PASSWORD`)

## الأوامر

| الأمر | الوظيفة |
|-------|---------|
| `npm run dev` | خادم التطوير |
| `npm run build` | بناء الإنتاج (يشمل `prisma generate`) |
| `npm run start` | تشغيل نسخة الإنتاج |
| `npm run lint` | ESLint |
| `npm run typecheck` | فحص أنواع TypeScript |
| `npm run db:migrate` | ترحيل قاعدة البيانات (تطوير) |
| `npm run db:deploy` | ترحيل قاعدة البيانات (إنتاج) |
| `npm run db:seed` | زرع البيانات الأولية |
| `npm run db:studio` | Prisma Studio |

## النشر على Vercel

1. ادفع المستودع إلى GitHub واربطه بمشروع Vercel جديد.
2. جهّز قاعدة بيانات PostgreSQL (Vercel Postgres / Neon / Supabase).
3. أضف متغيرات البيئة في إعدادات المشروع: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (رابط الدومين), `ADMIN_EMAIL`, `ADMIN_PASSWORD`.
4. أمر البناء الافتراضي `next build` كافٍ (يُنفَّذ `prisma generate` تلقائياً عبر `postinstall` و`build`).
5. بعد أول نشر، طبّق الترحيلات وازرع البيانات:
   ```bash
   npx prisma migrate deploy
   npm run db:seed
   ```
   (يمكن تنفيذها محلياً مع توجيه `DATABASE_URL` لقاعدة الإنتاج، أو عبر خطوة CI.)

## ملاحظات إنتاجية

- **Rate limiting**: التطبيق الحالي يستخدم مخزناً بالذاكرة (كافٍ لنسخة واحدة). للإنتاج متعدد النسخ استخدم Redis/Upstash.
- **السكربتات المخصصة** في مركز التتبع تُحقن مباشرةً في الصفحة — أضِف مصادر موثوقة فقط (الوصول محصور بالمشرف).
- غيّر `NEXTAUTH_SECRET` و`ADMIN_PASSWORD` إلى قيم قوية قبل الإنتاج.
