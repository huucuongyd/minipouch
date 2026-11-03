import Link from "next/link";
import { SocialIcon } from "@/components/SocialIcon";
import { nav, site } from "@/lib/site";
import { getActiveSocials, socialLabel } from "@/lib/site-settings";

export async function Footer() {
  const socials = await getActiveSocials();

  return (
    <footer className="mt-auto border-t border-sand bg-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
        <div className="space-y-3">
          <p className="font-serif text-3xl text-ink">{site.name}</p>
          <p className="max-w-xs text-sm leading-6 text-muted">
            Chiếc túi nhỏ đứng form — vừa đủ cho những gì bạn mang theo mỗi ngày.
          </p>
          {socials.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {socials.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${socialLabel(social.platform)} ${social.tag}`}
                  title={social.tag}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand text-sage transition hover:border-clay hover:text-clay"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          ) : null}
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
            {socials.map((social) => (
              <li key={social.platform}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ink"
                >
                  {social.tag}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-sand px-5 py-5 text-center text-xs text-muted">
        © 2026 {site.name}. May tay tại Việt Nam.
      </div>
    </footer>
  );
}
