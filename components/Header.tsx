import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLinks } from "@/components/NavLinks";
import { site } from "@/lib/site";

function LogoMark() {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-rose text-paper">
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <rect x="5" y="6" width="14" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 9.5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-sand/70 bg-cream/85 backdrop-blur-md">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" className="flex items-center gap-2.5">
          <LogoMark />
          <span className="font-serif text-2xl tracking-tight text-ink">{site.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <NavLinks className="text-sm tracking-wide" />
          <Link
            href="/lien-he"
            className="rounded-full bg-ink px-5 py-2.5 text-sm text-paper transition hover:bg-clay"
          >
            Đặt túi
          </Link>
        </nav>

        <MobileMenu />
      </div>
    </header>
  );
}
