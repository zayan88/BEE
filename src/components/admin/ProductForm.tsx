"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveProduct } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ProductDefaults = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  currencySymbol: string;
  stock: number;
  shippingFee: number;
  freeShippingQty: number | null;
  active: boolean;
  heroBadge: string | null;
  rating: number;
  ratingCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
};

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        defaultValue={defaultValue ?? undefined}
        placeholder={placeholder}
        required={required}
      />
    </div>
  );
}

export default function ProductForm({
  product,
}: {
  product?: ProductDefaults;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [active, setActive] = useState(product?.active ?? true);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    formData.set("active", active ? "true" : "false");
    startTransition(async () => {
      const res = await saveProduct(product?.id ?? null, formData);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>معلومات أساسية</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="اسم المنتج" name="name" defaultValue={product?.name} required placeholder="كريم سم النحل الطبيعي" />
          <Field label="الرابط (slug)" name="slug" defaultValue={product?.slug} placeholder="bee-venom-cream" />
          <Field label="العنوان الفرعي" name="tagline" defaultValue={product?.tagline} placeholder="تركيبة طبيعية سريعة الامتصاص" />
          <div className="flex flex-col gap-2">
            <Label htmlFor="description">الوصف</Label>
            <Textarea id="description" name="description" defaultValue={product?.description ?? ""} />
          </div>
          <Field label="شارة الهيرو" name="heroBadge" defaultValue={product?.heroBadge} placeholder="عرض اليوم: وفّر حتى 25,000 د.ع" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>التسعير والمخزون والشحن</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Field label="السعر" name="price" type="number" defaultValue={product?.price ?? 0} required />
          <Field label="السعر قبل الخصم" name="compareAtPrice" type="number" defaultValue={product?.compareAtPrice} />
          <Field label="رمز العملة" name="currencySymbol" defaultValue={product?.currencySymbol ?? "د.ع"} />
          <Field label="المخزون" name="stock" type="number" defaultValue={product?.stock ?? 0} />
          <Field label="رسوم الشحن" name="shippingFee" type="number" defaultValue={product?.shippingFee ?? 0} />
          <Field label="شحن مجاني عند كمية" name="freeShippingQty" type="number" defaultValue={product?.freeShippingQty} placeholder="اتركه فارغاً للتعطيل" />
          <Field label="التقييم (0-5)" name="rating" type="number" defaultValue={product?.rating ?? 4.9} />
          <Field label="عدد التقييمات" name="ratingCount" type="number" defaultValue={product?.ratingCount ?? 0} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>تحسين محركات البحث (SEO)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="عنوان الميتا" name="metaTitle" defaultValue={product?.metaTitle} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="metaDescription">وصف الميتا</Label>
            <Textarea id="metaDescription" name="metaDescription" defaultValue={product?.metaDescription ?? ""} />
          </div>
          <Field label="صورة المشاركة (OG Image URL)" name="ogImage" defaultValue={product?.ogImage} placeholder="https://..." />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between pt-5">
          <div>
            <Label>نشر المنتج</Label>
            <p className="text-xs text-brown-soft">إظهار المنتج على المتجر</p>
          </div>
          <Switch checked={active} onCheckedChange={setActive} />
        </CardContent>
      </Card>

      {error && (
        <div className="rounded-[14px] border-2 border-brand-red bg-[rgba(197,69,59,0.06)] px-4 py-3 text-center text-sm font-bold text-brand-red">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          إلغاء
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ..." : "حفظ المنتج"}
        </Button>
      </div>
    </form>
  );
}
