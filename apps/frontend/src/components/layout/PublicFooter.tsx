import Image from "next/image";
import Link from "next/link";
import { Facebook, Globe, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";

const institutionalLinks = [
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/areas-de-atuacao", label: "Áreas de atuação" },
  { href: "/projetos", label: "Projetos" },
  { href: "/transparencia", label: "Transparência" },
  { href: "/transparencia/emendas-parlamentares", label: "Emendas Parlamentares" },
  { href: "/contato", label: "Contato" },
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
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.8fr_1fr]">
        <div>
          <span className="inline-flex items-center gap-3">
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
          </span>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--brand-light-text)]">
            Organização da sociedade civil criada em Pereiro/CE, dedicada a inclusão social, educação, cultura,
            sustentabilidade, inovação e governança transparente.
          </p>
          <p className="mt-4 text-sm font-semibold text-[var(--brand-light-surface)]">
            CNPJ 04.347.564/0001-56
          </p>
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
                    className="inline-flex h-9 min-w-9 items-center justify-center gap-2 rounded-lg bg-white/10 px-3 text-xs font-bold text-white"
                  >
                    <Icon size={16} />
                    <span className="hidden sm:inline">{channel.name}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-xs font-semibold text-[var(--brand-light-text)] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Instituto Incentive. Todos os direitos reservados.</span>
          <span>Transparência, governança e impacto social.</span>
        </div>
      </div>
    </footer>
  );
}
