"use client";

import Link from "next/link";
import { nav } from "@/lib/site";

export function NavLinks({
  onNavigate,
  className,
}: {
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={`${className ?? ""} text-muted hover:text-ink`}
        >
          {item.label}
        </Link>
      ))}
    </>
  );
}
