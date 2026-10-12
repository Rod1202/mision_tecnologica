import type { Metadata, Viewport } from "next";
import "@fontsource-variable/urbanist";
import "./globals.css";

import { QuoteCartProvider } from "@/components/catalog/quote-cart";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Misión Tecnológica | Outsourcing tecnológico e impresión empresarial",
    template: "%s | Misión Tecnológica",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0066ff",
  width: "device-width",
  initialScale: 1,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}/brand/logo-mt-color.png`,
  email: siteConfig.contact.email,
  ...(siteConfig.social.linkedin ? { sameAs: [siteConfig.social.linkedin] } : {}),
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-PE">
      <body className="min-h-dvh overflow-x-clip">
        <a
          href="#contenido"
          className="sr-only z-50 rounded-full bg-brand-blue px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Saltar al contenido
        </a>
        <QuoteCartProvider>
          <SiteHeader />
          <main id="contenido">{children}</main>
          <SiteFooter />
          <WhatsAppFloat />
        </QuoteCartProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
      </body>
    </html>
  );
}
