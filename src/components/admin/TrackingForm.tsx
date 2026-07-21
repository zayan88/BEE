"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveTrackingSettings } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Defaults = {
  metaPixelId: string | null;
  tiktokPixelId: string | null;
  googleAnalyticsId: string | null;
  googleTagManagerId: string | null;
  snapchatPixelId: string | null;
  customHeadScripts: string | null;
  customBodyScripts: string | null;
};

function PixelField({
  label,
  name,
  hint,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  hint: string;
  defaultValue?: string | null;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} defaultValue={defaultValue ?? ""} placeholder={placeholder} dir="ltr" />
      <p className="text-xs text-brown-soft">{hint}</p>
    </div>
  );
}

export default function TrackingForm({ settings }: { settings: Defaults | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await saveTrackingSettings(formData);
      if (!res.ok) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>البكسلات والتتبع</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <PixelField label="Meta Pixel ID" name="metaPixelId" hint="معرّف بكسل فيسبوك/إنستغرام" defaultValue={settings?.metaPixelId} placeholder="1234567890" />
          <PixelField label="TikTok Pixel ID" name="tiktokPixelId" hint="معرّف بكسل تيك توك" defaultValue={settings?.tiktokPixelId} placeholder="XXXXXXXXXXXX" />
          <PixelField label="Google Analytics ID" name="googleAnalyticsId" hint="مثال: G-XXXXXXX" defaultValue={settings?.googleAnalyticsId} placeholder="G-XXXXXXX" />
          <PixelField label="Google Tag Manager ID" name="googleTagManagerId" hint="مثال: GTM-XXXXXX" defaultValue={settings?.googleTagManagerId} placeholder="GTM-XXXXXX" />
          <PixelField label="Snapchat Pixel ID" name="snapchatPixelId" hint="معرّف بكسل سناب شات" defaultValue={settings?.snapchatPixelId} placeholder="xxxxxxxx-xxxx" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>سكربتات مخصصة</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customHeadScripts">سكربت داخل &lt;head&gt;</Label>
            <Textarea id="customHeadScripts" name="customHeadScripts" defaultValue={settings?.customHeadScripts ?? ""} dir="ltr" className="min-h-[120px] font-mono text-xs" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customBodyScripts">سكربت داخل &lt;body&gt;</Label>
            <Textarea id="customBodyScripts" name="customBodyScripts" defaultValue={settings?.customBodyScripts ?? ""} dir="ltr" className="min-h-[120px] font-mono text-xs" />
          </div>
          <p className="rounded-xl bg-[rgba(197,69,59,0.06)] px-4 py-2.5 text-xs text-brand-red">
            ⚠️ أضف سكربتات من مصادر موثوقة فقط — تُحقن مباشرة في الصفحة.
          </p>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        {saved && <span className="text-sm font-bold text-brand-green">✓ تم الحفظ</span>}
        {error && <span className="text-sm font-bold text-brand-red">{error}</span>}
        <Button type="submit" disabled={pending}>
          {pending ? "جارٍ الحفظ..." : "حفظ الإعدادات"}
        </Button>
      </div>
    </form>
  );
}
