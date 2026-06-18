import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Facebook,
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

const institutionalLinks = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/areas-de-atuacao", label: "Áreas de atuação" },
  { href: "/projetos", label: "Projetos" },
  { href: "/contato", label: "Contato" },
];

const transparencyLinks = [
  { href: "/transparencia", label: "Portal da Transparência" },
  { href: "/transparencia/emendas-parlamentares", label: "Emendas Parlamentares" },
  { href: "/certificacoes-reconhecimentos", label: "Certificações e Reconhecimentos" },
];

const socialChannels = [
  { name: "Instagram", icon: Instagram },
  { name: "Facebook", icon: Facebook },
  { name: "LinkedIn", icon: Linkedin },
  { name: "YouTube", icon: Youtube },
];

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
            Organização da sociedade civil criada em Pereiro/CE, dedicada à inclusão social, educação, cultura,
            sustentabilidade, inovação e governança transparente.
          </p>
          <div className="mt-5 grid gap-2 text-sm font-semibold text-[var(--brand-light-surface)]">
            <span>CNPJ 04.347.564/0001-56</span>
            <span>Fundado em 2001</span>
            <span>Pereiro, Ceará</span>
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
                Esta área reúne documentos, certidões e dados para fortalecer publicidade, controle social e prestação de contas.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-[0.08em] text-[var(--brand-orange-light)]">
            Contato oficial
          </h2>
          <div className="mt-4 grid gap-3 text-sm text-[var(--brand-light-text)]">
            <a
              href="https://institutoincentive.org.br/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Globe size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              institutoincentive.org.br
            </a>
            <a href="mailto:contato@institutoincentive.org.br" className="flex items-center gap-3 transition hover:text-white">
              <Mail size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              <span className="break-all">contato@institutoincentive.org.br</span>
            </a>
            <a href="tel:+5588999252123" className="flex items-center gap-3 transition hover:text-white">
              <Phone size={17} className="shrink-0 text-[var(--brand-orange-light)]" />
              +55 (88) 99925-2123
            </a>
            <div className="flex items-start gap-3">
              <MapPin size={17} className="mt-0.5 shrink-0 text-[var(--brand-orange-light)]" />
              <span>Avenida José Milton de Morais, 394, Vila Nova, Pereiro/CE, CEP 63.460-000</span>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--brand-light-text)]">
              Redes sociais
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {socialChannels.map((channel) => {
                const Icon = channel.icon;

                return (
                  <span
                    key={channel.name}
                    title="Aguardando confirmação do perfil oficial"
                    className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-xs font-bold text-white"
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{channel.name}</span>
                  </span>
                );
              })}
            </div>
            <p className="mt-2 text-xs font-semibold leading-5 text-[var(--brand-light-text)]">
              Links serão ativados após confirmação dos perfis oficiais.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-semibold text-[var(--brand-light-text)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Instituto Incentive. Todos os direitos reservados.</span>
          <span className="inline-flex items-center gap-2">
            <FileText size={14} />
            Transparência, governança e impacto social.
          </span>
        </div>
      </div>
    </footer>
  );
}
