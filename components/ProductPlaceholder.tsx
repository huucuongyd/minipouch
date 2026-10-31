import Image from "next/image";
import { BagIllustration } from "@/components/BagIllustration";
import type { BagPattern } from "@/lib/products";

export function ProductPlaceholder({
  pattern,
  image,
  alt,
}: {
  pattern: BagPattern;
  image?: string;
  alt: string;
}) {
  if (image) {
    return (
      <Image
        src={image}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 100vw, 33vw"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-b from-sand/40 to-blush/20">
      <BagIllustration pattern={pattern} className="h-[88%] w-[88%]" />
    </div>
  );
}
