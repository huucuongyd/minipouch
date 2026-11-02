import Link from "next/link";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { getProducts } from "@/lib/catalog";

export default async function AdminHomePage() {
  const products = await getProducts();

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl text-ink">Sản phẩm</h2>
          <p className="mt-2 text-sm text-muted">{products.length} mẫu đang đăng.</p>
        </div>
        <Link
          href="/quan-tri/san-pham/moi"
          className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition hover:bg-clay"
        >
          Đăng sản phẩm
        </Link>
      </div>

      <ul className="mt-8 divide-y divide-sand overflow-hidden rounded-[28px] bg-paper ring-1 ring-sand">
        {products.length === 0 ? (
          <li className="px-5 py-8 text-sm text-muted">Chưa có túi nào.</li>
        ) : (
          products.map((product) => (
            <li
              key={product.id}
              className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-serif text-2xl text-ink">{product.name}</p>
                <p className="text-sm text-muted">
                  {product.price} · {product.size}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Link href={`/san-pham/${product.id}`} className="text-sm text-muted hover:text-ink">
                  Xem
                </Link>
                <Link
                  href={`/quan-tri/san-pham/${product.id}`}
                  className="text-sm text-ink underline decoration-blush underline-offset-4"
                >
                  Sửa
                </Link>
                <DeleteProductButton id={product.id} name={product.name} />
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
