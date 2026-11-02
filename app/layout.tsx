import type { Metadata } from "next";
import { Be_Vietnam_Pro, Cormorant_Garamond } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const title = `${site.name} — ${site.tagline}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title,
    description: site.description,
    url: site.url,
    siteName: site.name,
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-cream font-sans text-ink">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
