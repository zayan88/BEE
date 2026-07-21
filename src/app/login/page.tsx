import { Suspense } from "react";
import LoginForm from "./LoginForm";

export const metadata = { title: "تسجيل الدخول", robots: { index: false } };

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-5">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
