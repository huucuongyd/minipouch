import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { getCategories } from "@/lib/categories";

export const metadata: Metadata = {
  title: "Đăng sản phẩm",
  robots: { index: false, follow: false },
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <section className="mt-10 max-w-2xl">
      <Link href="/quan-tri" className="text-sm text-muted hover:text-ink">
        ← Danh sách
      </Link>
      <h2 className="mt-4 font-serif text-4xl text-ink">Đăng sản phẩm</h2>
      <div className="mt-6 rounded-[28px] bg-paper p-6 ring-1 ring-sand md:p-8">
        <ProductForm categories={categories} />
      </div>
    </section>
  );
}
