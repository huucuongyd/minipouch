import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { getProduct, getProducts } from "@/lib/catalog";
import { productGallery } from "@/lib/products";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: "Không tìm thấy sản phẩm" };
  }
  return {
    title: product.name,
    description: product.tagline,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-24 text-muted">Đang tải túi...</div>}>
      <ProductDetail params={params} />
    </Suspense>
  );
}

async function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const products = await getProducts();
  const others = products.filter((item) => item.id !== product.id).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
      <p className="text-sm text-muted">
        <Link href="/san-pham" className="hover:text-ink">
          Sản phẩm
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{product.name}</span>
      </p>

      <div className="mt-8 grid items-start gap-10 md:grid-cols-2">
        <ProductGallery
          images={productGallery(product)}
          pattern={product.pattern}
          alt={product.name}
        />

        <div>
          <p className="text-xs tracking-[0.25em] text-sage uppercase">
            May tay · đứng form
          </p>
          <h1 className="mt-3 font-serif text-5xl text-ink">{product.name}</h1>
          <p className="mt-4 text-xl text-clay">{product.price}</p>
          <p className="mt-2 text-sm text-sage">{product.size}</p>
          <p className="mt-6 leading-7 text-muted">{product.description}</p>
          <p className="mt-4 text-sm leading-6 text-muted">{product.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/lien-he?sp=${product.id}`}
              className="rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-clay"
            >
              Đặt túi này
            </Link>
            <Link
              href="/san-pham"
              className="rounded-full border border-sand bg-paper px-6 py-3 text-sm text-ink"
            >
              Xem mẫu khác
            </Link>
          </div>
        </div>
      </div>

      {others.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-serif text-3xl text-ink">Mẫu khác</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
