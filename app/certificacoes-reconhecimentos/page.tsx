import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  BadgeCheck,
  CalendarDays,
  Download,
  FileText,
  SearchCheck,
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Certificacoes e Reconhecimentos",
  description:
    "Certificados, cadastros e reconhecimentos obtidos pelo Instituto Incentive, incluindo cultura, CADASTUR e economia solidaria.",
  path: "/certificacoes-reconhecimentos",
});

const certifications = [
  {
    title: "Cadastro Nacional de Pontos e Pontões de Cultura",
    type: "Reconhecimento cultural",
    issuer: "Cadastro Nacional de Pontos e Pontões de Cultura",
    description:
      "Reconhecimento da atuação cultural e comunitária do Instituto Incentive no campo da cultura viva, da formação e da participação social.",
    href: "/documentos/certificacoes/cadastro-nacional-pontos-pontoes-cultura.pdf",
  },
  {
    title: "Certificado CADASTUR - Organizadora de Eventos",
    type: "Certificação em eventos",
    issuer: "CADASTUR",
    description:
      "Certificação que reconhece a atuação institucional na organização de eventos, fortalecendo a capacidade de execução de ações culturais, educativas e comunitárias.",
    href: "/documentos/certificacoes/certificado-cadastur-organizadora-eventos.pdf",
  },
  {
    title: "Certificado CADASTUR - Prestador Especializado em Segmentos",
    type: "Certificação setorial",
    issuer: "CADASTUR",
    description:
      "Certificação que amplia o reconhecimento do Instituto como prestador especializado em segmentos estratégicos ligados a experiências, eventos e desenvolvimento territorial.",
    href: "/documentos/certificacoes/certificado-cadastur-prestador-especializado-segmentos.pdf",
  },
  {
    title: "Declaração de Empreendimento Econômico Solidário - DCSOL",
    type: "Reconhecimento em economia solidária",
    issuer: "DCSOL",
    description:
      "Declaração que evidencia a vinculação do Instituto Incentive a iniciativas de economia solidária, inclusão produtiva e desenvolvimento social sustentável.",
    href: "/documentos/certificacoes/declaracao-empreendimento-economico-solidario-dcsol.pdf",
  },
];

const pageUpdatedAt = "18 de junho de 2026";
const availableCount = certifications.length;

export default function CertificationsAndRecognitionPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
              Certificações e Reconhecimentos
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Certificados, cadastros e reconhecimentos obtidos pelo Instituto Incentive.
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="#certificacoes"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)] sm:w-auto"
              >
                Ver certificações
                <ArrowRight size={18} />
              </a>
              <Link
                href="/transparencia"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:w-auto"
              >
                Ver Transparência
                <ArrowUpRight size={18} />
              </Link>
            </div>
          </div>
          <div className="min-w-0 space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Esta seção reúne reconhecimentos formais, certificações setoriais, cadastros públicos e declarações
              obtidas pelo Instituto Incentive em suas áreas de atuação.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Certidões fiscais, alvarás, CNPJ, estatuto, atas e demonstrações financeiras permanecem organizados na
              área de Transparência, pois são documentos de regularidade e prestação de contas.
            </p>
            <p className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-orange-soft)] px-4 py-3 text-sm font-bold text-[var(--brand-orange-dark)]">
              <CalendarDays size={18} />
              Página revisada em {pageUpdatedAt}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-4">
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <Award className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">{certifications.length}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">certificações e reconhecimentos listados</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <FileText className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">{availableCount}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">arquivos em PDF disponíveis</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <BadgeCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">4</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">frentes de reconhecimento institucional</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <SearchCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">Público</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">consulta direta pelo site institucional</p>
          </article>
        </div>
      </section>

      <section id="certificacoes" className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Acervo institucional</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Reconhecimentos obtidos pelo Instituto.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            A lista abaixo reúne conquistas, registros e certificações formais do Instituto Incentive. Itens
            administrativos de regularidade estão organizados separadamente no Portal da Transparência.
          </p>
        </div>

        <div className="grid w-full gap-5 lg:grid-cols-2">
          {certifications.map((certification) => (
              <article key={certification.title} className="min-w-0 rounded-lg border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-teal)]">
                    <BadgeCheck size={16} />
                    {certification.type}
                  </span>
                  <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                    Documento em PDF
                  </span>
                </div>

                <h3 className="mt-5 text-2xl font-bold text-[var(--brand-text)]">{certification.title}</h3>
                <p className="mt-2 text-sm font-semibold text-[var(--brand-muted)]">{certification.issuer}</p>
                <p className="mt-4 text-sm leading-7 text-[var(--brand-muted)]">{certification.description}</p>

                <TrackedAnchor
                  href={certification.href}
                  target="_blank"
                  rel="noreferrer"
                  eventName="document_open"
                  eventProperties={{ area: "certifications", document: certification.title }}
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)] sm:w-auto"
                >
                  Abrir certificado
                  <Download size={17} />
                </TrackedAnchor>
              </article>
            ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
