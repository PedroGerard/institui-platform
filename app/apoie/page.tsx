import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import { buildMailto, siteConfig } from "@/lib/site-config";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Handshake,
  Lightbulb,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Apoie o Instituto",
  description:
    "Faça parte da transformação social e do desenvolvimento territorial no semiárido cearense. Saiba como apoiar, patrocinar e ser parceiro do Instituto Incentive.",
  path: "/apoie",
});

const supportWays = [
  {
    icon: Users,
    title: "Pessoa Física e Cidadania",
    badge: "Doação e Engajamento",
    text: "Contribuições de cidadãos comprometidos com o fortalecimento comunitário, a democratização do acesso à cultura e o combate às desigualdades no semiárido.",
    cta: "Quero Contribuir como Pessoa Física",
  },
  {
    icon: Building2,
    title: "Empresas e Investimento Social (ESG)",
    badge: "Responsabilidade Social",
    text: "Parcerias com empresas para destinação de recursos via incentivo fiscal ou aporte direto, gerando valor compartilhado e impacto territorial mensurável.",
    cta: "Parceria Corporativa / ESG",
  },
  {
    icon: Sparkles,
    title: "Patrocínio a Projetos Específicos",
    badge: "Cultura e Qualificação",
    text: "Apoio direto a iniciativas como o Sons do Sertão, Beleza Criativa, Conexão Profissional ou workshops comunitários no Vale do Jaguaribe.",
    cta: "Patrocinar Projeto Específico",
  },
  {
    icon: Handshake,
    title: "Cooperação Institucional e Convênios",
    badge: "Setor Público e OSCs",
    text: "Acordos de cooperação técnica, termos de fomento e parcerias com universidades, prefeituras, órgãos governamentais e federações.",
    cta: "Propor Parceria Institucional",
  },
  {
    icon: Lightbulb,
    title: "Voluntariado e Mentoria Técnica",
    badge: "Capital Humano",
    text: "Profissionais de áreas como educação, tecnologia, saúde, direito e gestão que desejam ministrar oficinas e mentorar lideranças e jovens.",
    cta: "Inscrever-se para Voluntariado",
  },
  {
    icon: Megaphone,
    title: "Apresentar Oportunidade ou Edital",
    badge: "Redes e Editais",
    text: "Indicação de chamadas públicas, editais socioambientais e redes de financiamento alinhadas aos eixos programáticos do Instituto.",
    cta: "Apresentar Oportunidade",
  },
];

const safeguards = [
  "Todo apoio financeiro ou material possui destinação e plano de trabalho vinculados aos objetivos estatutários.",
  "As doações e termos de parceria são formalizados com documentação e emissão de recibos institucionais.",
  "A prestação de contas dos recursos é publicada periodicamente no Portal da Transparência.",
  "Garantia de conformidade com a legislação de incentivos fiscais, MROSC e LGPD.",
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Rede de Parcerias e Impacto
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Apoie a Transformação Territorial no Semiárido.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-muted)]">
              Sua organização, empresa ou contribuição individual potencializa ações reais de <strong>educação, formação profissional, cultura, inclusão produtiva e desenvolvimento sustentável</strong> em Pereiro e região.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedAnchor
                href={buildMailto("Proposta de Apoio ou Parceria ao Instituto Incentive")}
                eventName="support_contact_click"
                eventProperties={{ source: "support_hero", intent: "support" }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[var(--brand-teal-dark)]"
              >
                Conversar com a Equipe de Parcerias
                <ArrowRight size={18} />
              </TrackedAnchor>
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3.5 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              >
                Consultar Transparência
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-tint)] p-6 sm:p-8">
            <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--brand-orange-dark)]">Canal Oficial de Relacionamento</p>
            <h2 className="mt-2 text-xl font-extrabold text-[var(--brand-text)]">Informações Institucionais</h2>
            <div className="mt-5 space-y-3 text-sm font-semibold text-[var(--brand-text)]">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">Organização</span>
                <span className="mt-1 block font-extrabold text-[var(--brand-teal)]">{siteConfig.fullName}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">CNPJ</span>
                  <span className="mt-1 block font-extrabold">{siteConfig.cnpj}</span>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">Sede</span>
                  <span className="mt-1 block font-extrabold">Pereiro/CE</span>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">E-mail para Convênios e Parcerias</span>
                <span className="mt-1 block break-all font-extrabold text-[var(--brand-teal)]">{siteConfig.email}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Modalidades de Colaboração</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Caminhos para Somar Forças com o Instituto.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Estruturamos modelos flexíveis e transparentes de cooperação adequados a diferentes perfis de apoiadores:
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {supportWays.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="flex flex-col justify-between rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm transition duration-200 hover:border-[var(--brand-teal)] hover:shadow-md">
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                        <Icon size={24} />
                      </div>
                      <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-extrabold text-[var(--brand-text)]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{item.text}</p>
                  </div>

                  <div className="mt-6 border-t border-[var(--brand-border-soft)] pt-4">
                    <TrackedAnchor
                      href={buildMailto(`Apoio: ${item.title}`)}
                      eventName="support_contact_click"
                      eventProperties={{ category: item.title }}
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
                    >
                      {item.cta}
                      <ArrowRight size={14} />
                    </TrackedAnchor>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <ShieldCheck className="text-[var(--brand-teal)]" size={36} />
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--brand-text)]">
              Governança, Integridade e Prestação de Contas.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Todo recurso investido no Instituto Incentive é submetido a rigorosos mecanismos de governança, dupla autorização e transparência pública permanente.
            </p>
          </div>
          <div className="grid gap-3.5">
            {safeguards.map((safeguard) => (
              <div key={safeguard} className="flex items-start gap-3 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 shadow-sm">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={20} />
                <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{safeguard}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white py-14">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold">Vamos construir uma iniciativa conjunta?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Entre em contato direto com nossa diretoria para apresentar demandas territoriais ou desenhar programas de cooperação.
            </p>
          </div>
          <TrackedAnchor
            href={buildMailto("Proposta de Parceria Estratégica")}
            eventName="support_contact_click"
            eventProperties={{ source: "support_bottom_cta" }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Apresentar Proposta
            <ArrowRight size={18} />
          </TrackedAnchor>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
