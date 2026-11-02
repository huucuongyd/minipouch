import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const instant = false;

export const metadata: Metadata = {
  title: "Quản trị",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<p className="px-5 py-24 text-center text-muted">Đang mở trang quản trị...</p>}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}
