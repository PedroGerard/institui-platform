import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildMailto, siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  HeartHandshake,
  Mail,
  Megaphone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Apoie o Instituto",
  description:
    "Apoie o Instituto Incentive por meio de parcerias, voluntariado, divulgação institucional, patrocínios responsáveis e projetos de impacto social.",
  path: "/apoie",
});

const supportImage =
  "https://images.pexels.com/photos/6647019/pexels-photo-6647019.jpeg?auto=compress&cs=tinysrgb&w=1800";

const supportWays = [
  {
    icon: Building2,
    title: "Parcerias institucionais",
    text: "Empresas, órgãos públicos, universidades e organizações podem cocriar projetos, ações territoriais e programas de formação.",
  },
  {
    icon: Users,
    title: "Voluntariado e mentoria",
    text: "Profissionais podem contribuir com oficinas, mentorias, apoio técnico, formação, comunicação, tecnologia ou gestão.",
  },
  {
    icon: HeartHandshake,
    title: "Doações e patrocínios responsáveis",
    text: "Apoios financeiros, materiais ou técnicos são tratados com registro, finalidade definida, transparência e prestação de contas.",
  },
  {
    icon: Megaphone,
    title: "Divulgação da causa",
    text: "Compartilhar projetos, campanhas e oportunidades ajuda o Instituto a alcançar mais pessoas, parceiros e comunidades.",
  },
];

const safeguards = [
  "Todo apoio deve ter finalidade institucional clara.",
  "Parcerias e doações passam por validação documental.",
  "Informações públicas ficam disponíveis no Portal da Transparência.",
  "Dados pessoais são tratados conforme a Política de Privacidade.",
];

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="relative overflow-hidden bg-[var(--brand-text)] text-white">
        <Image
          src={supportImage}
          alt="Pessoas unindo as mãos em gesto de cooperação"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-55"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,63,68,0.96)_0%,rgba(0,104,113,0.82)_48%,rgba(0,104,113,0.24)_100%)]" />

        <div className="relative mx-auto grid min-h-[62svh] max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-sm font-bold text-white backdrop-blur">
              <Sparkles size={17} />
              Fortaleça projetos de impacto social
            </div>
            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Apoie o Instituto Incentive.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-light-surface)]">
              Sua organização, empresa ou rede pode contribuir para ampliar oportunidades de educação, cultura,
              inovação, inclusão social e desenvolvimento sustentável no território.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <TrackedAnchor
                href={buildMailto("Quero apoiar o Instituto Incentive")}
                eventName="support_contact_click"
                eventProperties={{ source: "support_hero", intent: "support" }}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold text-[var(--brand-text)] shadow-sm transition hover:bg-[var(--brand-orange-light)]"
              >
                Quero apoiar
                <ArrowRight size={18} />
              </TrackedAnchor>
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/32 bg-white/14 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/22"
              >
                Ver transparência
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/18 bg-white/12 p-5 backdrop-blur">
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-light)]">Contato oficial</p>
            <div className="mt-4 grid gap-3 text-sm font-semibold text-white">
              <TrackedAnchor
                href={`mailto:${siteConfig.email}`}
                eventName="contact_channel_click"
                eventProperties={{ channel: "email", page: "support" }}
                className="flex items-center gap-3 rounded-lg bg-white/10 p-4 transition hover:bg-white/15"
              >
                <Mail size={18} className="text-[var(--brand-orange-light)]" />
                <span className="break-all">{siteConfig.email}</span>
              </TrackedAnchor>
              <div className="rounded-lg bg-white/10 p-4">
                <p>{siteConfig.fullName}</p>
                <p className="mt-1 text-[var(--brand-light-surface)]">CNPJ {siteConfig.cnpj}</p>
                <p className="mt-1 text-[var(--brand-light-surface)]">{siteConfig.address.line}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Formas de apoio</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Caminhos responsáveis para colaborar com a missão institucional.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {supportWays.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
                  <Icon className="text-[var(--brand-teal)]" size={30} />
                  <h3 className="mt-5 text-xl font-extrabold">{item.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <ShieldCheck className="text-[var(--brand-teal)]" size={34} />
            <h2 className="mt-4 text-3xl font-extrabold">Compromisso com governança e transparência.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              O Instituto Incentive busca organizar cada apoio com rastreabilidade, documentação e comunicação pública
              compatíveis com sua natureza institucional.
            </p>
          </div>
          <div className="grid gap-3">
            {safeguards.map((item) => (
              <div key={item} className="flex items-start gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={20} />
                <p className="text-sm font-semibold leading-6">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-extrabold">Vamos conversar sobre a melhor forma de colaborar?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">
              Envie uma mensagem com o tipo de apoio, instituição, cidade e objetivo da parceria.
            </p>
          </div>
          <TrackedAnchor
            href={buildMailto("Apoio institucional ao Instituto Incentive")}
            eventName="support_contact_click"
            eventProperties={{ source: "support_footer", intent: "partnership" }}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:bg-[var(--brand-orange-light)]"
          >
            Enviar proposta de apoio
            <ArrowRight size={18} />
          </TrackedAnchor>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
