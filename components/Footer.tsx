import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-sand bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-3xl text-ink">{site.name}</p>
          <p className="max-w-xs text-sm leading-6 text-muted">
            Túi vải hình hộp may tay, {site.size}. Nhỏ xinh, đủ chỗ cho ngày của bạn.
          </p>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-sage uppercase">Khám phá</p>
          <ul className="mt-4 space-y-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs tracking-[0.2em] text-sage uppercase">Liên hệ</p>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>{site.address}</li>
            <li>
              <a href={site.phoneHref} className="hover:text-ink">
                {site.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="hover:text-ink">
                {site.email}
              </a>
            </li>
            <li>
              <a href={site.instagram} className="hover:text-ink">
                {site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-sand px-5 py-5 text-center text-xs text-muted">
        © 2026 {site.name}. May tay tại Việt Nam.
      </div>
    </footer>
  );
}
