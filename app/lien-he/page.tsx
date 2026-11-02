import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/ContactForm";
import { getProducts } from "@/lib/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Gửi form liên hệ NuBeNa để đặt túi vải may tay, hỏi vải, hoặc đặt may theo yêu cầu.",
};

async function ContactPanel() {
  const products = await getProducts();
  return <ContactForm products={products.map((product) => ({ id: product.id, name: product.name }))} />;
}

export default function ContactPage() {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
      <div>
        <p className="text-xs tracking-[0.25em] text-sage uppercase">Liên hệ</p>
        <h1 className="mt-3 font-serif text-5xl text-ink">
          Gửi lời nhắn cho chúng mình
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-muted">
          Đặt túi, hỏi màu vải, hay muốn may một chiếc làm quà — điền form, mail
          sẽ tới hộp thư NuBeNa. Chúng mình trả lời trong giờ làm việc.
        </p>
        <div className="mt-10 rounded-[28px] bg-paper p-6 ring-1 ring-sand md:p-8">
          <Suspense fallback={<p className="text-sm text-muted">Đang tải form...</p>}>
            <ContactPanel />
          </Suspense>
        </div>
      </div>

      <aside className="space-y-6 md:pt-24">
        <div className="rounded-[28px] bg-blush/25 p-6">
          <p className="text-xs tracking-[0.2em] text-clay uppercase">Studio</p>
          <p className="mt-3 font-serif text-2xl text-ink">{site.address}</p>
          <p className="mt-2 text-sm text-muted">{site.hours}</p>
        </div>
        <div className="rounded-[28px] border border-sand bg-paper p-6">
          <p className="text-xs tracking-[0.2em] text-sage uppercase">Kết nối</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={site.phoneHref} className="text-ink hover:text-clay">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="text-ink hover:text-clay">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram} className="text-ink hover:text-clay">
                Instagram {site.instagramHandle}
              </a>
            </li>
            <li>
              <a href={site.facebook} className="text-ink hover:text-clay">
                Facebook NuBeNa
              </a>
            </li>
          </ul>
        </div>
        <p className="text-xs leading-5 text-muted">
          Thường trả lời trong ngày làm việc. Nếu gấp, nhắn Instagram cho nhanh.
        </p>
      </aside>
    </div>
  );
}
