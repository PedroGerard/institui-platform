import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Award,
  BadgeCheck,
  Download,
  FileText,
  SearchCheck,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Certificações e Reconhecimentos",
  description:
    "Conheça os certificados, cadastros públicos e reconhecimentos obtidos pelo Instituto Incentive junto ao Ministério da Cultura, CADASTUR e DCSOL.",
  path: "/certificacoes-reconhecimentos",
});

const certifications = [
  {
    title: "Cadastro Nacional de Pontos e Pontões de Cultura",
    type: "Reconhecimento Cultural",
    issuer: "Ministério da Cultura (MinC) / Secretaria da Cidadania e Diversidade Cultural",
    description:
      "Certificado de inserção e reconhecimento no Cadastro Nacional de Pontos e Pontões de Cultura do Governo Federal, atestando a realização de ações culturais continuadas de relevância pública.",
    href: "/documentos/certificacoes/cadastro-nacional-pontos-pontoes-cultura.pdf",
  },
  {
    title: "Certificado CADASTUR - Organizadora de Eventos",
    type: "Certificação Setorial",
    issuer: "Ministério do Turismo / CADASTUR",
    description:
      "Certificação oficial que habilita o Instituto Incentive como organizadora de eventos técnicos, sociais, culturais e comunitários, em conformidade com os padrões do setor de turismo.",
    href: "/documentos/certificacoes/certificado-cadastur-organizadora-eventos.pdf",
  },
  {
    title: "Certificado CADASTUR - Prestador Especializado em Segmentos",
    type: "Certificação Especializada",
    issuer: "Ministério do Turismo / CADASTUR",
    description:
      "Certificação que qualifica o Instituto como prestador especializado em segmentos de turismo cívico, cultural, comunitário e pedagógico no território.",
    href: "/documentos/certificacoes/certificado-cadastur-prestador-especializado-segmentos.pdf",
  },
  {
    title: "Declaração de Empreendimento Econômico Solidário - DCSOL",
    type: "Economia Solidária",
    issuer: "Departamento de Fomento à Economia Solidária (DCSOL)",
    description:
      "Documento que comprova a vinculação do Instituto Incentive aos princípios da economia popular e solidária, inclusão socioprodutiva e governança democrática.",
    href: "/documentos/certificacoes/declaracao-empreendimento-economico-solidario-dcsol.pdf",
  },
];

export default function CertificationsAndRecognitionPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Qualificação Institucional
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Certificações e Reconhecimentos.
            </h1>
          </div>
          <div className="space-y-4 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Esta página reúne os <strong>certificados setoriais, cadastros públicos e reconhecimentos oficiais</strong> obtidos pelo Instituto Incentive perante órgãos do Governo Federal e conselhos competentes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Ver Portal da Transparência
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-text)] text-white py-12">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-5 sm:px-8 md:grid-cols-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <Award className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-extrabold">4</p>
            <p className="mt-2 text-sm text-[var(--brand-light-text)]">Certificações e cadastros oficiais</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <FileText className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-extrabold">100%</p>
            <p className="mt-2 text-sm text-[var(--brand-light-text)]">Documentos em PDF disponíveis</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <BadgeCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-extrabold">Federal</p>
            <p className="mt-2 text-sm text-[var(--brand-light-text)]">Reconhecimento em ministérios</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <SearchCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-extrabold">Público</p>
            <p className="mt-2 text-sm text-[var(--brand-light-text)]">Consulta livre no site oficial</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Acervo Oficial</p>
          <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Certificados e Registros Ativos</h2>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            Abaixo estão discriminados os registros formais que comprovam a aptidão técnica e institucional da organização:
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {certifications.map((cert) => (
            <article key={cert.title} className="flex flex-col justify-between rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm transition hover:border-[var(--brand-teal)] hover:shadow-md">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--brand-teal)]">
                    <BadgeCheck size={16} />
                    {cert.type}
                  </span>
                  <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                    PDF Autenticado
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-extrabold text-[var(--brand-text)]">{cert.title}</h3>
                <p className="mt-1.5 text-sm font-bold text-[var(--brand-teal)]">{cert.issuer}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{cert.description}</p>
              </div>

              <div className="mt-6 border-t border-[var(--brand-border-soft)] pt-4">
                <TrackedAnchor
                  href={cert.href}
                  target="_blank"
                  rel="noreferrer"
                  eventName="document_open"
                  eventProperties={{ area: "certifications", document: cert.title }}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
                >
                  Abrir Certificado em PDF
                  <Download size={16} />
                </TrackedAnchor>
              </div>
            </article>
          ))}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
