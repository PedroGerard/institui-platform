import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Youtube,
} from "lucide-react";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { siteConfig } from "@/lib/site-config";

const institutionalLinks = [
  { href: "/quem-somos", label: "Quem Somos" },
  { href: "/areas-de-atuacao", label: "Áreas de Atuação" },
  { href: "/projetos", label: "Projetos" },
  { href: "/certificacoes-reconhecimentos", label: "Certificações e Reconhecimentos" },
  { href: "/apoie", label: "Apoie" },
  { href: "/contato", label: "Contato" },
];

const transparencyLinks = [
  { href: "/transparencia", label: "Portal da Transparência" },
  { href: "/transparencia/emendas-parlamentares", label: "Emendas Parlamentares" },
];

const legalLinks = [
  { href: "/privacidade", label: "Política de Privacidade" },
  { href: "/acessibilidade", label: "Acessibilidade" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/contato", label: "Contato" },
];

const socialIcons = {
  Instagram,
  Facebook: () => (
    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  LinkedIn: Linkedin,
  YouTube: Youtube,
};

export function PublicFooter() {
  return (
    <footer className="border-t border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.1fr_0.75fr_0.85fr_1fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-3" aria-label="Instituto Incentive">
            <Image
              src="/images/brand/instituto-incentive-symbol.png"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-contain"
            />
            <span>
              <span className="block text-lg font-extrabold">Instituto Incentive</span>
              <span className="block text-sm font-semibold text-[var(--brand-orange-light)]">
                Inovação, Desenvolvimento e Transformação Social
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--brand-light-text)]">
            Organização da Sociedade Civil (OSC) fundada em Pereiro/CE, dedicada ao desenvolvimento territorial, inovação social, educação, cultura, sustentabilidade, fortalecimento comunitário e governança transparente.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-semibold text-[var(--brand-light-surface)]">
            <span>CNPJ {siteConfig.cnpj}</span>
            <span>Fundado em {siteConfig.foundedAt}</span>
            <span>{siteConfig.address.short}</span>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--brand-orange-light)]">
            Navegação
          </h2>
          <div className="mt-4 grid gap-2">
            {institutionalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="w-fit rounded-md py-1 text-sm font-semibold text-[var(--brand-light-text)] transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--brand-orange-light)]">
            Consulta pública
          </h2>
          <div className="mt-4 grid gap-2">
            {transparencyLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex w-fit items-center gap-2 rounded-md py-1 text-sm font-semibold text-[var(--brand-light-text)] transition hover:text-white"
              >
                {link.label}
                <ArrowUpRight size={14} className="opacity-70 transition group-hover:opacity-100" />
              </Link>
            ))}
          </div>
          <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.06] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck size={18} className="mt-0.5 shrink-0 text-[var(--brand-orange-light)]" />
              <p className="text-xs font-semibold leading-5 text-[var(--brand-light-text)]">
                Documentos institucionais, emendas e dados públicos reunidos para fortalecer publicidade, controle social e prestação de contas.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--brand-orange-light)]">
            Contato oficial
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--brand-light-text)]">
            <TrackedAnchor
              href={siteConfig.url}
              target="_blank"
              rel="noreferrer"
              eventName="contact_channel_click"
              eventProperties={{ channel: "site", page: "footer" }}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Globe size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              {siteConfig.domain}
            </TrackedAnchor>
            <TrackedAnchor
              href={`mailto:${siteConfig.email}`}
              eventName="contact_channel_click"
              eventProperties={{ channel: "email", page: "footer" }}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Mail size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              <span className="break-all">{siteConfig.email}</span>
            </TrackedAnchor>
            <TrackedAnchor
              href={siteConfig.phone.href}
              eventName="contact_channel_click"
              eventProperties={{ channel: "phone", page: "footer" }}
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Phone size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              {siteConfig.phone.label}
            </TrackedAnchor>
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--brand-orange-light)]" />
              <span>{siteConfig.address.line}</span>
            </div>
          </div>

          {siteConfig.socialProfiles.length > 0 ? (
            <div className="mt-6">
              <h3 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--brand-light-text)]">
                Redes sociais
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {siteConfig.socialProfiles.map((channel) => {
                  const Icon = socialIcons[channel.name];

                  return (
                    <TrackedAnchor
                      key={channel.name}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      eventName="social_link_click"
                      eventProperties={{ network: channel.name, page: "footer" }}
                      className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-xs font-bold text-white transition hover:bg-white/20"
                    >
                      {Icon ? <Icon size={16} /> : null}
                      <span className="hidden sm:inline">{channel.label ?? channel.name}</span>
                    </TrackedAnchor>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-semibold text-[var(--brand-light-text)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Instituto Incentive. Todos os direitos reservados.</span>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="inline-flex items-center gap-2 transition hover:text-white">
                <FileText size={14} />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
