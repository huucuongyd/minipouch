"use client";

import Link from "next/link";
import { useState } from "react";
import { NavLinks } from "@/components/NavLinks";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-sand text-ink"
        aria-expanded={open}
        aria-label="Mở menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="sr-only">Menu</span>
        <span className="flex flex-col gap-1.5">
          <span className="block h-px w-4 bg-ink" />
          <span className="block h-px w-4 bg-ink" />
          <span className="block h-px w-3 bg-ink" />
        </span>
      </button>

      {open ? (
        <div className="absolute inset-x-0 top-full border-b border-sand bg-cream px-5 py-4">
          <nav className="flex flex-col gap-3">
            <NavLinks className="py-1" onNavigate={() => setOpen(false)} />
            <Link
              href="/lien-he"
              className="mt-2 rounded-full bg-ink px-5 py-2.5 text-center text-sm text-paper"
              onClick={() => setOpen(false)}
            >
              Đặt túi
            </Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
