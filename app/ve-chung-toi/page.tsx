import type { Metadata } from "next";
import Link from "next/link";
import { BagIllustration } from "@/components/BagIllustration";

export const metadata: Metadata = {
  title: "Về chúng tôi",
  description:
    "Sứ mệnh NuBeNa: may túi vải hình hộp nhỏ xinh, hữu dụng cho bạn gái trẻ — làm quà, đựng mỹ phẩm, hộp cơm và đồ nhỏ gọn.",
};

const values = [
  {
    title: "May tay, từng chiếc",
    body: "Không chạy theo số lượng. Mỗi đường chỉ được hoàn thiện chậm, để túi đứng form và bền khi mang mỗi ngày.",
  },
  {
    title: "Đẹp mà dùng được",
    body: "Xinh không có nghĩa là chỉ để trưng. Túi phải đựng được hộp cơm, bộ skincare mini, và vẫn vừa balo.",
  },
  {
    title: "Món quà mang đi được",
    body: "Chúng mình tin quà đẹp nhất là thứ người nhận dùng thật. Nhỏ, chỉn chu, không phải thứ cất tủ.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <p className="text-xs tracking-[0.25em] text-sage uppercase">Về chúng tôi</p>
        <h1 className="mt-4 font-serif text-5xl leading-[1.15] text-ink md:text-6xl">
          Sứ mệnh của NuBeNa
        </h1>
        <p className="mt-6 text-lg leading-8 text-muted">
          May những chiếc túi nhỏ — để ngày thường của bạn gái trẻ cũng có một góc
          được nâng niu.
        </p>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-20 md:grid-cols-2">
          <div className="rounded-[36px] bg-sage/15 p-8">
            <BagIllustration pattern="linen" className="mx-auto max-w-sm" />
          </div>
          <div className="space-y-5 leading-7 text-muted">
            <p className="text-xs tracking-[0.25em] text-sage uppercase">Vì sao có mặt</p>
            <h2 className="font-serif text-4xl text-ink">
              Vì túi “xinh” thường quên mất là phải đựng được đồ
            </h2>
            <p>
              NuBeNa bắt đầu từ một nỗi bực rất đời: đi làm, đi học, đi chơi —
              lúc nào cũng có một đống nhỏ cần chỗ. Son, sạc, hộp cơm, một món quà
              mang theo. Túi lớn thì rối. Túi nhựa thì lạnh. Túi “cute” thì hay
              xẹp, không đứng, chẳng đựng được gì ra hồn.
            </p>
            <p>
              Chúng mình chọn hình hộp, khoảng{" "}
              <strong className="font-medium text-ink">15×25cm</strong>. Đủ cho khay
              cơm văn phòng. Đủ một set mỹ phẩm đi làm. Đủ để gói thành quà mà
              người nhận cầm lên là muốn dùng ngay — không phải lịch sự cất đi.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <blockquote className="font-serif text-3xl leading-snug text-ink md:text-4xl">
          “Chúng mình may túi không phải để bạn có thêm một món đồ. Mà để những
          thứ bạn mang theo mỗi ngày được ở trong một chiếc túi xứng đáng.”
        </blockquote>
        <p className="mt-6 text-sm text-muted">— Đội ngũ NuBeNa</p>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <h2 className="font-serif text-4xl text-ink">Điều chúng mình giữ</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((item) => (
              <article
                key={item.title}
                className="rounded-[28px] border border-sand bg-cream p-6"
              >
                <h3 className="font-serif text-2xl text-ink">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="font-serif text-4xl text-ink">Dành cho ai?</h2>
        <p className="mt-5 leading-7 text-muted">
          Cho bạn gái đang tuổi học, đi làm những năm đầu, hoặc bất kỳ ai thích
          đồ nhỏ mà chỉn chu. Bạn mang túi đi cafe, đi họp, đi họp lớp. Bạn tặng
          bạn thân, tặng đồng nghiệp, tặng “phiên bản mình của tháng này”.
        </p>
        <p className="mt-4 leading-7 text-muted">
          NuBeNa không cố làm mọi thứ. Chúng mình làm một chiếc túi hình hộp,
          may tay, đúng cỡ — rồi làm nó đủ đẹp để bạn muốn cầm mỗi ngày.
        </p>
        <Link
          href="/lien-he"
          className="mt-8 inline-flex rounded-full bg-ink px-6 py-3 text-sm text-paper transition hover:bg-clay"
        >
          Kể chúng mình nghe bạn cần chiếc túi thế nào
        </Link>
      </section>
    </div>
  );
}
