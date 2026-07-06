import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Building2,
  Download,
  FileText,
  Mail,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Transparencia",
  description:
    "Portal da Transparencia do Instituto Incentive com documentos institucionais, certidoes, governanca, relatorios, contas e informacoes publicas.",
  path: "/transparencia",
});

const publishedDocumentSections = [
  {
    title: "Documentos institucionais",
    description: "Atos constitutivos, registro público e identificação formal do Instituto.",
    documents: [
      {
        title: "Estatuto Social Reformado - RPJ",
        href: "/documentos/transparencia/estatuto-social-reformado-rpj.pdf",
      },
      {
        title: "Ata de eleição e posse - RPJ",
        href: "/documentos/transparencia/ata-eleicao-posse-rpj.pdf",
      },
      {
        title: "Comprovante de inscrição e situação cadastral - CNPJ",
        href: "/documentos/transparencia/cartao-cnpj-instituto-incentive.pdf",
      },
    ],
  },
  {
    title: "Licenças e conformidade",
    description: "Autorizações e certificados necessários ao funcionamento institucional.",
    documents: [
      {
        title: "Alvará de funcionamento",
        href: "/documentos/transparencia/alvara-funcionamento.pdf",
      },
      {
        title: "Alvará sanitário",
        href: "/documentos/transparencia/alvara-sanitario.pdf",
      },
      {
        title: "Certificado de conformidade simplificado",
        href: "/documentos/transparencia/certificado-conformidade-simplificado.pdf",
      },
    ],
  },
  {
    title: "Certidões negativas e regularidade",
    description: "Comprovações de regularidade fiscal, trabalhista, correcional e cadastral.",
    documents: [
      {
        title: "Certidão negativa federal",
        href: "/documentos/transparencia/certidao-negativa-federal.pdf",
      },
      {
        title: "Certidão negativa estadual",
        href: "/documentos/transparencia/certidao-negativa-estadual.pdf",
      },
      {
        title: "Documento estadual complementar",
        href: "/documentos/transparencia/documento-estadual-complementar.pdf",
      },
      {
        title: "Certidão negativa municipal",
        href: "/documentos/transparencia/certidao-negativa-municipal.pdf",
      },
      {
        title: "Certidão negativa trabalhista",
        href: "/documentos/transparencia/certidao-negativa-trabalhista.pdf",
      },
      {
        title: "Certidão de regularidade do FGTS - maio/2026",
        href: "/documentos/transparencia/certidao-regularidade-fgts-maio-2026.pdf",
      },
      {
        title: "Certidão de regularidade do FGTS - abril/2026",
        href: "/documentos/transparencia/certidao-regularidade-fgts-abril-2026.pdf",
      },
      {
        title: "Certidão de falência e recuperação judicial",
        href: "/documentos/transparencia/certidao-falencia-recuperacao-judicial.pdf",
      },
      {
        title: "Certidão negativa correcional - Entes privados",
        href: "/documentos/transparencia/certidao-negativa-entes-privados-cgu.pdf",
      },
    ],
  },
  {
    title: "Relatórios e contas",
    description: "Demonstrações financeiras e documentos de prestação de contas institucional.",
    documents: [
      {
        title: "Demonstrações financeiras e notas explicativas",
        href: "/documentos/transparencia/demonstracoes-financeiras-notas-explicativas.pdf",
      },
    ],
  },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Transparência</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Governança, documentos e prestação de contas em linguagem clara.
            </h1>
          </div>
          <div className="min-w-0 space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Portal da Transparência reúne documentos oficiais do Instituto Incentive para consulta pública,
              incluindo atos constitutivos, registros, licenças, certidões, demonstrações financeiras e canais de
              solicitação de informações.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/transparencia/emendas-parlamentares"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)] sm:w-auto"
              >
                Ver Emendas Parlamentares
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/certificacoes-reconhecimentos"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:w-auto"
              >
                Certificações e Reconhecimentos
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Documentos publicados</p>
              <h2 className="mt-3 text-3xl font-bold text-[var(--brand-text)] sm:text-4xl">
                Documentos oficiais do Instituto Incentive.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                Os anexos abaixo estão publicados por finalidade para consulta, verificação e prestação de informações
                ao público.
              </p>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {publishedDocumentSections.map((section) => (
              <article key={section.title} className="rounded-lg border border-[var(--brand-border)] bg-white shadow-sm">
                <div className="p-5">
                  <h3 className="text-xl font-bold text-[var(--brand-text)]">{section.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{section.description}</p>
                </div>

                <div className="border-t border-[var(--brand-border)]">
                  {section.documents.map((document) => (
                    <TrackedAnchor
                      key={document.href}
                      href={document.href}
                      target="_blank"
                      rel="noreferrer"
                      eventName="document_open"
                      eventProperties={{ area: "transparency", document: document.title }}
                      className="flex items-center justify-between gap-4 border-b border-[var(--brand-border-soft)] px-5 py-4 text-[var(--brand-text)] transition last:border-b-0 hover:bg-[var(--brand-surface)]"
                    >
                      <span className="flex items-start gap-3 text-sm font-semibold leading-6">
                        <FileText className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                        {document.title}
                      </span>
                      <span className="inline-flex shrink-0 items-center gap-2 text-xs font-bold uppercase text-[var(--brand-teal)]">
                        PDF
                        <Download size={16} />
                      </span>
                    </TrackedAnchor>
                  ))}
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      <section className="bg-[var(--brand-tint)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <Building2 className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-2xl font-bold">Solicitação de informações</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Pedidos de informação sobre documentos institucionais, regularidade, parcerias ou prestação de contas
              podem ser encaminhados ao canal oficial de contato do Instituto.
            </p>
          </div>

          <div className="grid min-w-0 gap-3">
            <a
              href="mailto:contato@institutoincentive.org.br?subject=Solicitação%20de%20informações%20-%20Transparência"
              className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-semibold sm:text-base">contato@institutoincentive.org.br</span>
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-muted)]">
              Última atualização: 03 de junho de 2026
            </p>
          </div>
        </div>
      </section>
      <PublicFooter />
    </main>
  );
}
