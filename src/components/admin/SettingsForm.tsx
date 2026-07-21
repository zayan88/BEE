"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { saveSiteSettings } from "@/server/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Defaults = {
  storeName: string;
  supportPhone: string | null;
  supportEmail: string | null;
  defaultShipping: number;
  currencySymbol: string;
};

export default function SettingsForm({ settings }: { settings: Defaults | null }) {
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
      const res = await saveSiteSettings(formData);
      if (!res.ok) setError(res.error);
      else {
        setSaved(true);
        router.refresh();
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="grid max-w-2xl gap-6">
      <Card>
        <CardHeader>
          <CardTitle>إعدادات المتجر</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="storeName">اسم المتجر</Label>
            <Input id="storeName" name="storeName" defaultValue={settings?.storeName ?? ""} required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="supportPhone">هاتف الدعم</Label>
              <Input id="supportPhone" name="supportPhone" defaultValue={settings?.supportPhone ?? ""} dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="supportEmail">بريد الدعم</Label>
              <Input id="supportEmail" name="supportEmail" type="email" defaultValue={settings?.supportEmail ?? ""} dir="ltr" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="defaultShipping">رسوم الشحن الافتراضية</Label>
              <Input id="defaultShipping" name="defaultShipping" type="number" defaultValue={settings?.defaultShipping ?? 0} />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currencySymbol">رمز العملة</Label>
              <Input id="currencySymbol" name="currencySymbol" defaultValue={settings?.currencySymbol ?? "د.ع"} />
            </div>
          </div>
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
