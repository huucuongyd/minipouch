"use client";

import { useState } from "react";
import { ProductPlaceholder } from "@/components/ProductPlaceholder";
import type { BagPattern } from "@/lib/products";

export function ProductGallery({
  images,
  pattern,
  alt,
}: {
  images: string[];
  pattern: BagPattern;
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const current = total > 0 ? images[Math.min(index, total - 1)] : undefined;

  function go(delta: number) {
    if (total < 2) return;
    setIndex((value) => (value + delta + total) % total);
  }

  return (
    <div className="overflow-hidden rounded-[32px] bg-paper ring-1 ring-sand">
      <div className="relative aspect-square">
        <ProductPlaceholder pattern={pattern} image={current} alt={alt} />

        {total > 1 ? (
          <>
            <button
              type="button"
              aria-label="Ảnh trước"
              onClick={() => go(-1)}
              className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm ring-1 ring-sand transition hover:bg-paper"
            >
              <Chevron direction="left" />
            </button>
            <button
              type="button"
              aria-label="Ảnh sau"
              onClick={() => go(1)}
              className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-sm ring-1 ring-sand transition hover:bg-paper"
            >
              <Chevron direction="right" />
            </button>
            <p className="absolute right-4 bottom-4 rounded-full bg-ink/70 px-3 py-1 text-xs text-paper">
              {index + 1} / {total}
            </p>
          </>
        ) : null}
      </div>

      {total > 1 ? (
        <div className="flex gap-2 overflow-x-auto px-4 py-3">
          {images.map((image, i) => (
            <button
              key={`${image}-${i}`}
              type="button"
              aria-label={`Xem ảnh ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition ${
                i === index ? "ring-clay" : "ring-transparent opacity-70 hover:opacity-100"
              }`}
            >
              <ProductPlaceholder
                pattern={pattern}
                image={image}
                alt={`${alt} — ảnh ${i + 1}`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className="h-4 w-4"
    >
      <path
        d={direction === "left" ? "M12 4L6 10l6 6" : "M8 4l6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
