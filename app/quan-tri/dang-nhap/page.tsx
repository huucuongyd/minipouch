import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Đăng nhập quản trị",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-center text-muted">Đang mở trang đăng nhập...</p>}>
      <LoginScreen />
    </Suspense>
  );
}

async function LoginScreen() {
  if (await isAdmin()) redirect("/quan-tri");

  return (
    <div className="mx-auto max-w-md px-5 py-20">
      <p className="text-xs tracking-[0.25em] text-sage uppercase">Quản trị</p>
      <h1 className="mt-3 font-serif text-5xl text-ink">Đăng nhập</h1>
      <p className="mt-4 text-sm leading-6 text-muted">
        Dùng tài khoản trong biến admin_acc và admin_pass.
      </p>
      <div className="mt-8 rounded-[28px] bg-paper p-6 ring-1 ring-sand md:p-8">
        <LoginForm configured={adminConfigured()} />
      </div>
    </div>
  );
}
