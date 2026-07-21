"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/admin";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("بيانات الدخول غير صحيحة");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="w-full max-w-[420px] rounded-[28px] border border-[rgba(200,147,46,0.15)] bg-white p-8 shadow-[var(--shadow-lg)]">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-honey to-gold text-2xl shadow-[var(--shadow-gold)]">
          🐝
        </div>
        <h1 className="text-2xl">لوحة التحكم</h1>
        <p className="text-sm text-brown-soft">سجّل الدخول للمتابعة</p>
      </div>
      <form onSubmit={submit} className="grid gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            dir="ltr"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            dir="ltr"
          />
        </div>
        {error && (
          <div className="rounded-[14px] border-2 border-brand-red bg-[rgba(197,69,59,0.06)] px-4 py-2.5 text-center text-sm font-bold text-brand-red">
            {error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "جارٍ الدخول..." : "دخول"}
        </Button>
      </form>
    </div>
  );
}
