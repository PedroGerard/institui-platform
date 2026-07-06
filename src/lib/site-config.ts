export type SocialProfileName = "Instagram" | "Facebook" | "LinkedIn" | "YouTube";

export type SocialProfile = {
  name: SocialProfileName;
  href: string;
  label?: string;
};

const socialProfiles: SocialProfile[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/instituto.incentive/",
    label: "@instituto.incentive",
  },
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/company/institutoincentive.osc/",
    label: "Instituto Incentive",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/institutoincentive.osc",
    label: "institutoincentive.osc",
  },
];

export const siteConfig = {
  name: "Instituto Incentive",
  fullName: "Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social",
  cnpj: "04.347.564/0001-56",
  foundedAt: "2001",
  domain: "institutoincentive.org.br",
  url: "https://www.institutoincentive.org.br",
  email: "contato@institutoincentive.org.br",
  phone: {
    label: "+55 (88) 99925-2123",
    href: "tel:+5588999252123",
  },
  address: {
    line: "Avenida José Milton de Morais, 394, Vila Nova, Pereiro/CE, CEP 63.460-000",
    short: "Pereiro, Ceará",
  },
  socialProfiles,
};

export function buildMailto(subject: string, body?: string) {
  const params = new URLSearchParams({ subject });

  if (body) {
    params.set("body", body);
  }

  return `mailto:${siteConfig.email}?${params.toString()}`;
}
