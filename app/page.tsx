import Link from "next/link";
import { BagIllustration } from "@/components/BagIllustration";
import { ProductCard } from "@/components/ProductCard";
import { UseIcon } from "@/components/UseIcon";
import { products, testimonials, uses } from "@/lib/products";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 h-80 w-80 rounded-full bg-blush/40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-10 h-64 w-64 rounded-full bg-sage/20 blur-3xl" />
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="text-xs tracking-[0.25em] text-sage uppercase">
              Túi vải may tay · {site.size}
            </p>
            <h1 className="mt-4 font-serif text-5xl leading-[1.1] text-ink md:text-6xl">
              Chiếc túi nhỏ cho những ngày{" "}
              <em className="text-clay">đầy ắp</em>
            </h1>
            <p className="mt-6 max-w-md text-base leading-7 text-muted">
              MiniPouch may túi vải hình hộp — gọn trong balo, xinh trên bàn. Đựng
              mỹ phẩm, hộp cơm, hay gói thành món quà nhỏ cho người thương.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/san-pham"
                className="rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-clay"
              >
                Xem túi
              </Link>
              <Link
                href="/lien-he"
                className="rounded-full border border-sand bg-paper px-6 py-3 text-sm text-ink transition hover:border-blush"
              >
                Đặt may / hỏi hàng
              </Link>
            </div>
          </div>

          <div className="relative mx-auto h-[380px] w-full max-w-md md:h-[460px]">
            <div className="absolute top-8 left-6 w-44 rotate-[-12deg] opacity-80">
              <BagIllustration pattern="gingham" />
            </div>
            <div className="absolute right-4 bottom-2 w-44 rotate-[10deg] opacity-90">
              <BagIllustration pattern="linen" />
            </div>
            <div className="absolute inset-x-12 top-0">
              <BagIllustration pattern="floral" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-sand bg-paper">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-8 text-center sm:grid-cols-3">
          {["May tay từng chiếc", "Kích thước 15 × 25 cm", "Vải cotton / linen"].map(
            (item) => (
              <p key={item} className="text-sm tracking-wide text-muted">
                {item}
              </p>
            ),
          )}
        </div>
      </section>

      <section id="san-pham" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-20">
        <div className="max-w-xl">
          <p className="text-xs tracking-[0.25em] text-sage uppercase">Bộ sưu tập</p>
          <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            Mỗi chiếc một tính cách
          </h2>
          <p className="mt-4 text-muted">
            Cùng kích thước 15×25cm. Chọn họa tiết mình thích rồi nhắn chúng mình.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link
          href="/san-pham"
          className="mt-8 inline-flex text-sm text-clay underline decoration-blush underline-offset-4"
        >
          Xem tất cả sản phẩm
        </Link>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <div className="max-w-xl">
            <p className="text-xs tracking-[0.25em] text-sage uppercase">Dùng thế nào</p>
            <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
              Một túi, nhiều góc nhỏ trong ngày
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {uses.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-sand bg-cream p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blush/40 text-clay">
                  <UseIcon name={item.icon} />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
        <div className="rounded-[36px] bg-blush/30 p-6 md:p-10">
          <div className="mx-auto max-w-xs">
            <BagIllustration pattern="dots" />
          </div>
        </div>
        <div>
          <p className="text-xs tracking-[0.25em] text-sage uppercase">Câu chuyện</p>
          <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
            May vì những điều nhỏ cũng đáng được nâng niu
          </h2>
          <p className="mt-5 leading-7 text-muted">
            Chúng mình bắt đầu MiniPouch khi không tìm được chiếc túi vừa xinh vừa
            hữu dụng — cái thì quá “đồ chơi”, cái thì nhựa cứng, cái thì to đến mức
            chẳng biết nhét vào đâu. Hình hộp 15×25cm ra đời từ đúng khoảng trống
            đó: đủ chỗ, không thành gánh.
          </p>
          <Link
            href="/ve-chung-toi"
            className="mt-8 inline-flex text-sm text-clay underline decoration-blush underline-offset-4"
          >
            Đọc về sứ mệnh của chúng mình
          </Link>
        </div>
      </section>

      <section className="border-y border-sand bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-serif text-4xl text-ink">Lời từ những bạn đã dùng</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <blockquote
                key={item.name}
                className="rounded-[28px] bg-cream p-6 ring-1 ring-sand"
              >
                <p className="font-serif text-xl leading-8 text-ink">“{item.quote}”</p>
                <footer className="mt-5 text-sm text-muted">
                  <span className="text-ink">{item.name}</span> · {item.meta}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <p className="text-xs tracking-[0.25em] text-sage uppercase">Đặt hàng</p>
        <h2 className="mt-3 font-serif text-4xl text-ink md:text-5xl">
          Chọn một chiếc, hoặc để chúng mình may riêng cho bạn
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-muted">
          Gửi form liên hệ, chúng mình phản hồi qua email. Phù hợp làm quà, đựng
          đồ makeup, hộp cơm và mọi thứ nhỏ gọn khác.
        </p>
        <Link
          href="/lien-he"
          className="mt-8 inline-flex rounded-full bg-ink px-8 py-3.5 text-sm text-paper transition hover:bg-clay"
        >
          Nhắn MiniPouch
        </Link>
      </section>
    </div>
  );
}
