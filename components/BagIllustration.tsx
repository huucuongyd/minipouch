import { useId } from "react";
import type { BagPattern } from "@/lib/products";

type BagPalette = {
  body: string;
  dark: string;
  light: string;
  stitch: string;
  zipper: string;
  accent: string;
};

const palettes: Record<string, BagPalette> = {
  floral: {
    body: "#F3D5C8",
    dark: "#E8B4A8",
    light: "#FAE6DC",
    stitch: "#C97B73",
    zipper: "#8B6F5A",
    accent: "#C4726A",
  },
  gingham: {
    body: "#D5E0D3",
    dark: "#B7C9B6",
    light: "#E7EEE6",
    stitch: "#6F8B74",
    zipper: "#6B5C56",
    accent: "#4F6A55",
  },
  linen: {
    body: "#EDE4D8",
    dark: "#D9CBB8",
    light: "#F7F1E8",
    stitch: "#A89078",
    zipper: "#6B5C56",
    accent: "#8A7A6A",
  },
  dots: {
    body: "#F2C9C4",
    dark: "#E3A8A2",
    light: "#FADDD9",
    stitch: "#C4726A",
    zipper: "#6B5C56",
    accent: "#A65D57",
  },
};

const fallbackPalette = palettes.linen;

function PatternFill({
  pattern,
  id,
  accent,
  dark,
}: {
  pattern: string;
  id: string;
  accent: string;
  dark: string;
}) {
  if (pattern === "gingham") {
    return (
      <pattern id={id} width="16" height="16" patternUnits="userSpaceOnUse">
        <rect width="16" height="16" fill="transparent" />
        <rect width="8" height="16" fill={dark} opacity="0.35" />
        <rect width="16" height="8" fill={accent} opacity="0.22" />
      </pattern>
    );
  }

  if (pattern === "dots") {
    return (
      <pattern id={id} width="14" height="14" patternUnits="userSpaceOnUse">
        <circle cx="4" cy="4" r="2.2" fill={accent} opacity="0.55" />
        <circle cx="11" cy="11" r="1.6" fill={dark} opacity="0.4" />
      </pattern>
    );
  }

  if (pattern === "linen") {
    return (
      <pattern id={id} width="8" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8 L8 0" stroke={dark} strokeWidth="0.6" opacity="0.25" />
        <path d="M-2 4 L4 -2" stroke={accent} strokeWidth="0.5" opacity="0.18" />
      </pattern>
    );
  }

  return (
    <pattern id={id} width="28" height="28" patternUnits="userSpaceOnUse">
      <circle cx="8" cy="10" r="2.4" fill={accent} opacity="0.55" />
      <circle cx="8" cy="10" r="1" fill={dark} opacity="0.45" />
      <path
        d="M8 7.2 C7.2 6.2 5.8 6.4 5.8 7.8 C5.8 9.4 8 11.2 8 11.2 C8 11.2 10.2 9.4 10.2 7.8 C10.2 6.4 8.8 6.2 8 7.2Z"
        fill={accent}
        opacity="0.7"
      />
      <circle cx="20" cy="20" r="1.8" fill={dark} opacity="0.35" />
      <path
        d="M21 16.8 C20.4 16.1 19.4 16.2 19.4 17.2 C19.4 18.3 21 19.6 21 19.6 C21 19.6 22.6 18.3 22.6 17.2 C22.6 16.2 21.6 16.1 21 16.8Z"
        fill={accent}
        opacity="0.55"
      />
    </pattern>
  );
}

export function BagIllustration({
  pattern = "floral",
  className,
}: {
  pattern?: BagPattern;
  className?: string;
}) {
  const uid = useId().replaceAll(":", "");
  const clipId = `bag-${uid}`;
  const fillId = `fill-${uid}`;
  const palette = palettes[pattern] ?? fallbackPalette;
  const fillPattern = palettes[pattern] ? pattern : "linen";

  return (
    <svg
      viewBox="0 0 220 250"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="42" y="48" width="136" height="158" rx="22" />
        </clipPath>
        <PatternFill
          pattern={fillPattern}
          id={fillId}
          accent={palette.accent}
          dark={palette.dark}
        />
      </defs>

      <ellipse cx="110" cy="228" rx="62" ry="10" fill="#2C2420" opacity="0.08" />

      <path
        d="M178 78 L198 92 L198 198 C198 210 188 220 176 220 L160 220 L160 70 Z"
        fill={palette.dark}
      />
      <rect x="38" y="46" width="140" height="162" rx="24" fill={palette.body} />
      <rect
        x="38"
        y="46"
        width="140"
        height="162"
        rx="24"
        fill={`url(#${fillId})`}
      />
      <rect
        x="38"
        y="46"
        width="140"
        height="162"
        rx="24"
        stroke={palette.stitch}
        strokeWidth="2.5"
        opacity="0.55"
      />
      <rect
        x="50"
        y="62"
        width="116"
        height="132"
        rx="16"
        stroke={palette.stitch}
        strokeWidth="1.4"
        strokeDasharray="4 6"
        opacity="0.7"
      />

      <rect x="46" y="46" width="124" height="28" rx="14" fill={palette.light} />
      <rect
        x="58"
        y="56"
        width="100"
        height="7"
        rx="3.5"
        fill={palette.zipper}
        opacity="0.85"
      />
      <rect x="142" y="53" width="12" height="14" rx="3" fill={palette.zipper} />
      <rect x="145" y="66" width="6" height="10" rx="2" fill={palette.accent} />

      <g clipPath={`url(#${clipId})`}>
        <rect x="42" y="48" width="136" height="158" fill={`url(#${fillId})`} />
      </g>
    </svg>
  );
}
