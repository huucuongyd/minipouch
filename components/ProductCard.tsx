import Link from "next/link";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group overflow-hidden rounded-[28px] bg-paper shadow-[0_12px_40px_-24px_rgba(44,36,32,0.35)] ring-1 ring-sand/80">
      <Link href={`/san-pham/${product.id}`} className="block">
        <div className="relative aspect-4/5 overflow-hidden">
          <ProductPlaceholder
            pattern={product.pattern}
            image={product.image}
            alt={product.name}
          />
        </div>
        <div className="space-y-2 px-5 py-5">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-2xl text-ink">{product.name}</h3>
            <p className="text-sm font-medium text-clay">{product.price}</p>
          </div>
          <p className="text-sm leading-6 text-muted">{product.tagline}</p>
          <p className="text-xs tracking-wide text-sage">{product.size}</p>
        </div>
      </Link>
    </article>
  );
}
