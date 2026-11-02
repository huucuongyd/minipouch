import { createLinkPreview, linkPreviewAlt, linkPreviewSize } from "@/lib/link-preview";

export const alt = linkPreviewAlt;
export const size = linkPreviewSize;
export const contentType = "image/png";

export default function Image() {
  return createLinkPreview();
}
