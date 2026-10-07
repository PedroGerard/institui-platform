import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsentBanner } from "@/components/analytics/CookieConsentBanner";
import { GoogleMeasurement } from "@/components/analytics/GoogleMeasurement";
import { absoluteUrl, defaultSeoDescription, seoKeywords } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Instituto Incentive",
    template: "%s | Instituto Incentive",
  },
  description: defaultSeoDescription,
  keywords: seoKeywords,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    title: "Instituto Incentive",
    description: "Projetos, transparencia e transformacao social com origem em Pereiro/CE.",
    url: siteConfig.url,
    siteName: "Instituto Incentive",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: absoluteUrl("/images/brand/instituto-incentive-logo.png"),
        width: 1024,
        height: 1024,
        alt: "Marca do Instituto Incentive",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Instituto Incentive",
    description: "Projetos, transparencia e transformacao social com origem em Pereiro/CE.",
    images: [absoluteUrl("/images/brand/instituto-incentive-logo.png")],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: siteConfig.name,
  legalName: siteConfig.fullName,
  url: siteConfig.url,
  logo: absoluteUrl("/images/brand/instituto-incentive-logo.png"),
  foundingDate: siteConfig.foundedAt,
  taxID: siteConfig.cnpj,
  email: siteConfig.email,
  telephone: siteConfig.phone.label,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "institutional contact",
    email: siteConfig.email,
    telephone: siteConfig.phone.label,
    areaServed: "BR",
    availableLanguage: "Portuguese",
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "Avenida Jose Milton de Morais, 394, Vila Nova",
    addressLocality: "Pereiro",
    addressRegion: "CE",
    postalCode: "63460-000",
    addressCountry: "BR",
  },
  areaServed: ["Pereiro", "Ceara", "Vale do Jaguaribe", "Brasil"],
  knowsAbout: [
    "educacao",
    "cultura",
    "inclusao social",
    "sustentabilidade",
    "terceiro setor",
    "governanca",
    "transparencia",
  ],
  sameAs: siteConfig.socialProfiles.map((profile) => profile.href),
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: "pt-BR",
  publisher: {
    "@type": "NGO",
    name: siteConfig.name,
    url: siteConfig.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <GoogleMeasurement />
        {children}
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </body>
    </html>
  );
}
