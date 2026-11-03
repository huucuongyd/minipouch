import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { logout } from "@/app/quan-tri/actions";
import { isAdmin } from "@/lib/admin-session";
import { catalogMode } from "@/lib/catalog";

const storageNote = {
  blob: "Sản phẩm đang lưu trên Vercel Blob và hiện ở trang bán hàng.",
  file: "Đang lưu trên máy này, trong data/products.json. Bản trên Vercel chỉ đổi khi project có Blob store.",
  readonly:
    "Chưa lưu được trên Vercel. Trong project, tạo Storage → Blob, kết nối Development, rồi chạy vercel env pull.",
} as const;

export async function AdminShell({ children }: { children: ReactNode }) {
  if (!(await isAdmin())) redirect("/quan-tri/dang-nhap");
  const mode = catalogMode();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs tracking-[0.25em] text-sage uppercase">Quản trị</p>
          <h1 className="mt-2 font-serif text-4xl text-ink">NuBeNa</h1>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-full border border-sand bg-paper px-5 py-2.5 text-sm text-ink"
          >
            Đăng xuất
          </button>
        </form>
      </div>
      <p
        className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
          mode === "readonly" ? "bg-rose/15 text-clay" : "bg-paper text-muted ring-1 ring-sand"
        }`}
      >
        {storageNote[mode]}
      </p>
      {children}
    </div>
  );
}
