import type { Metadata } from "next";
import { siteConfig } from "./site-config";

export const siteUrl = siteConfig.url;

export const defaultSeoDescription =
  "Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social: organizacao da sociedade civil de Pereiro/CE com projetos de educacao, cultura, inclusao, sustentabilidade e transparencia.";

export const seoKeywords = [
  "Instituto Incentive",
  "OSC",
  "ONG",
  "Pereiro CE",
  "Ceara",
  "Vale do Jaguaribe",
  "projetos sociais",
  "educacao",
  "cultura",
  "inclusao social",
  "transparencia",
  "terceiro setor",
  "apoio institucional",
  "voluntariado",
  "doacoes para ONG",
  "Google Ad Grants",
];

export const publicSitemapRoutes = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/quem-somos", priority: 0.9, changeFrequency: "monthly" },
  { path: "/areas-de-atuacao", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projetos", priority: 0.95, changeFrequency: "weekly" },
  { path: "/certificacoes-reconhecimentos", priority: 0.8, changeFrequency: "monthly" },
  { path: "/apoie", priority: 0.85, changeFrequency: "monthly" },
  { path: "/transparencia", priority: 0.95, changeFrequency: "weekly" },
  { path: "/transparencia/emendas-parlamentares", priority: 0.9, changeFrequency: "monthly" },
  { path: "/contato", priority: 0.75, changeFrequency: "monthly" },
  { path: "/privacidade", priority: 0.55, changeFrequency: "yearly" },
  { path: "/acessibilidade", priority: 0.55, changeFrequency: "yearly" },
] as const;

export function absoluteUrl(path = "/") {
  return new URL(path, siteUrl).toString();
}

export function buildPageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);
  const imageUrl = absoluteUrl("/images/brand/instituto-incentive-logo.png");

  return {
    title,
    description,
    keywords: seoKeywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      locale: "pt_BR",
      type: "website",
      images: [
        {
          url: imageUrl,
          width: 1024,
          height: 1024,
          alt: `${siteConfig.name} - ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
