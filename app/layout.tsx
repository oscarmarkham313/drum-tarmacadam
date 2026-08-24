import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { site } from "@/config/copy";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-archivo",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.domain),
  title: {
    default: "Dublin Growth Digital — We get you customers.",
    template: "%s — Dublin Growth Digital",
  },
  description: site.metaDescription,
  alternates: { canonical: "/" },
  openGraph: {
    title: "Dublin Growth Digital — We get you customers.",
    description: site.metaDescription,
    url: site.domain,
    siteName: site.name,
    locale: "en_IE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dublin Growth Digital — We get you customers.",
    description: site.metaDescription,
  },
};

export const viewport: Viewport = {
  themeColor: "#fafafa",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: site.name,
  description: site.metaDescription,
  url: site.domain,
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Dublin",
    addressCountry: "IE",
  },
  sameAs: [site.instagram, site.facebook],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={archivo.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Nav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
