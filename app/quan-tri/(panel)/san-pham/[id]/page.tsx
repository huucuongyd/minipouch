import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProduct } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Sửa sản phẩm",
  robots: { index: false, follow: false },
};

export default function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<p className="mt-10 text-sm text-muted">Đang tải sản phẩm...</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <section className="mt-10 max-w-2xl">
      <Link href="/quan-tri" className="text-sm text-muted hover:text-ink">
        ← Danh sách
      </Link>
      <h2 className="mt-4 font-serif text-4xl text-ink">Sửa {product.name}</h2>
      <div className="mt-6 rounded-[28px] bg-paper p-6 ring-1 ring-sand md:p-8">
        <ProductForm product={product} />
      </div>
    </section>
  );
}
