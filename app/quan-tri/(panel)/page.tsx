import Link from "next/link";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { SocialLinksForm } from "@/components/admin/SocialLinksForm";
import { getCategories } from "@/lib/categories";
import { getProducts } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/site-settings";

export default async function AdminHomePage() {
  const [products, categories, settings] = await Promise.all([
    getProducts(),
    getCategories(),
    getSiteSettings(),
  ]);
  const categoryLabel = new Map(categories.map((category) => [category.id, category.label]));

  return (
    <>
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
                    {categoryLabel.get(product.pattern)
                      ? ` · ${categoryLabel.get(product.pattern)}`
                      : ""}
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

      <section className="mt-14">
        <div>
          <h2 className="font-serif text-3xl text-ink">Danh mục</h2>
          <p className="mt-2 text-sm text-muted">
            Thêm, sửa tên, hoặc xóa danh mục dùng khi đăng sản phẩm. Không xóa được nếu còn sản phẩm
            đang gắn.
          </p>
        </div>
        <div className="mt-6 overflow-hidden rounded-[28px] bg-paper p-5 ring-1 ring-sand md:p-8">
          <CategoryManager categories={categories} />
        </div>
      </section>

      <section className="mt-14">
        <div>
          <h2 className="font-serif text-3xl text-ink">Mạng xã hội</h2>
          <p className="mt-2 text-sm text-muted">
            Sửa link và tag. Icon hiện ở footer khi có link; để trống link để ẩn.
          </p>
        </div>
        <div className="mt-6 overflow-hidden rounded-[28px] bg-paper p-5 ring-1 ring-sand md:p-8">
          <SocialLinksForm socials={settings.socials} />
        </div>
      </section>
    </>
  );
}
