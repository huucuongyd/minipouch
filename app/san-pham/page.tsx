import type { Metadata } from "next";
import { ProductCard } from "@/components/ProductCard";
import { products } from "@/lib/products";

export const metadata: Metadata = {
  title: "Sản phẩm",
  description:
    "Túi vải hình hộp 15×25cm may tay — xem toàn bộ mẫu MiniPouch và đặt theo họa tiết bạn thích.",
};

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="text-xs tracking-[0.25em] text-sage uppercase">Sản phẩm</p>
      <h1 className="mt-3 font-serif text-5xl text-ink md:text-6xl">
        Túi vải đang có
      </h1>
      <p className="mt-4 max-w-xl leading-7 text-muted">
        {products.length} mẫu hình hộp, cùng cỡ 15×25cm. Chọn họa tiết rồi nhắn
        chúng mình để đặt.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
