import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  ArrowRight,
  Building2,
  Download,
  FileCheck,
  FileText,
  Landmark,
  Mail,
  Scale,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Portal da Transparência",
  description:
    "Acesse documentos institucionais, certidões de regularidade, atos constitutivos, demonstrações contábeis e emendas parlamentares do Instituto Incentive.",
  path: "/transparencia",
});

const publishedDocumentSections = [
  {
    category: "01. Institucional e Atos Constitutivos",
    description: "Estatuto Social registrado, atos constitutivos e licenças operacionais de funcionamento.",
    icon: Landmark,
    documents: [
      {
        title: "Estatuto Social Reformado (RPJ)",
        href: "/documentos/transparencia/estatuto-social-reformado-rpj.pdf",
      },
      {
        title: "Cartão do CNPJ - Instituto Incentive",
        href: "/documentos/transparencia/cartao-cnpj-instituto-incentive.pdf",
      },
      {
        title: "Alvará de Funcionamento",
        href: "/documentos/transparencia/alvara-funcionamento.pdf",
      },
      {
        title: "Alvará Sanitário",
        href: "/documentos/transparencia/alvara-sanitario.pdf",
      },
      {
        title: "Certificado de Conformidade Simplificado",
        href: "/documentos/transparencia/certificado-conformidade-simplificado.pdf",
      },
    ],
  },
  {
    category: "02. Governança e Mandatos",
    description: "Atas de eleição e posse da Diretoria Executiva e Conselho Fiscal.",
    icon: ShieldCheck,
    documents: [
      {
        title: "Ata de Eleição e Posse da Diretoria e Conselho Fiscal (RPJ)",
        href: "/documentos/transparencia/ata-eleicao-posse-rpj.pdf",
      },
    ],
  },
  {
    category: "03. Regularidade Fiscal, Trabalhista e Jurídica",
    description: "Certidões negativas perante órgãos federais, estaduais, municipais, trabalhistas e correcionais.",
    icon: Scale,
    documents: [
      {
        title: "Certidão Negativa de Débitos Federais e Previdenciários",
        href: "/documentos/transparencia/certidao-negativa-federal.pdf",
      },
      {
        title: "Certidão Negativa de Débitos Tributários Estaduais",
        href: "/documentos/transparencia/certidao-negativa-estadual.pdf",
      },
      {
        title: "Documento Estadual Complementar",
        href: "/documentos/transparencia/documento-estadual-complementar.pdf",
      },
      {
        title: "Certidão Negativa de Débitos Municipais",
        href: "/documentos/transparencia/certidao-negativa-municipal.pdf",
      },
      {
        title: "Certidão Negativa de Débitos Trabalhistas (CNDT)",
        href: "/documentos/transparencia/certidao-negativa-trabalhista.pdf",
      },
      {
        title: "Certidão de Regularidade do FGTS (CRF) - Maio/2026",
        href: "/documentos/transparencia/certidao-regularidade-fgts-maio-2026.pdf",
      },
      {
        title: "Certidão de Regularidade do FGTS (CRF) - Abril/2026",
        href: "/documentos/transparencia/certidao-regularidade-fgts-abril-2026.pdf",
      },
      {
        title: "Certidão de Falência e Recuperação Judicial",
        href: "/documentos/transparencia/certidao-falencia-recuperacao-judicial.pdf",
      },
      {
        title: "Certidão Negativa Correcional - Entes Privados (CGU)",
        href: "/documentos/transparencia/certidao-negativa-entes-privados-cgu.pdf",
      },
    ],
  },
  {
    category: "04. Demonstrações Contábeis e Financeiras",
    description: "Balanços, demonstrativos contábeis e notas explicativas em conformidade com as normas ITG 2002.",
    icon: FileCheck,
    documents: [
      {
        title: "Demonstrações Financeiras e Notas Explicativas",
        href: "/documentos/transparencia/demonstracoes-financeiras-notas-explicativas.pdf",
      },
    ],
  },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Controle Social e Integridade
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Portal da Transparência Institucional.
            </h1>
          </div>
          <div className="space-y-4 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Instituto Incentive disponibiliza publicamente seus <strong>atos constitutivos, atas de governança, certidões de regularidade, demonstrações contábeis e prestação de contas</strong> para consulta de parceiros, conselhos, órgãos públicos e da comunidade.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/transparencia/emendas-parlamentares"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Emendas Parlamentares
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/certificacoes-reconhecimentos"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              >
                Certificações e Reconhecimentos
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Acervo Documental Oficial</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Documentos Públicos Organizados por Finalidade.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Todos os documentos abaixo estão autenticados e disponíveis para download e conferência pública imediata.
            </p>
          </div>

          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {publishedDocumentSections.map((section) => {
              const Icon = section.icon;

              return (
                <article key={section.category} className="overflow-hidden rounded-xl border border-[var(--brand-border)] bg-white shadow-sm">
                  <div className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                        <Icon size={20} />
                      </div>
                      <h3 className="text-lg font-extrabold text-[var(--brand-text)]">{section.category}</h3>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{section.description}</p>
                  </div>

                  <div className="border-t border-[var(--brand-border-soft)]">
                    {section.documents.map((doc) => (
                      <TrackedAnchor
                        key={doc.href}
                        href={doc.href}
                        target="_blank"
                        rel="noreferrer"
                        eventName="document_open"
                        eventProperties={{ area: "transparency", document: doc.title }}
                        className="flex items-center justify-between gap-4 border-b border-[var(--brand-border-soft)] px-6 py-4 text-[var(--brand-text)] transition last:border-b-0 hover:bg-[var(--brand-surface)]"
                      >
                        <span className="flex items-start gap-3 text-sm font-semibold leading-6">
                          <FileText className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                          {doc.title}
                        </span>
                        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[var(--brand-tint)] px-2.5 py-1 text-xs font-bold uppercase text-[var(--brand-teal)]">
                          PDF
                          <Download size={14} />
                        </span>
                      </TrackedAnchor>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Building2 className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-text)]">Serviço de Informação ao Cidadão (SIC)</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Para esclarecimentos adicionais, certidões específicas ou solicitações documentais, utilize nosso canal institucional permanente de transparência.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href="mailto:contato@institutoincentive.org.br?subject=Solicita%C3%A7%C3%A3o%20de%20Informa%C3%A7%C3%B5es%20-%20Transpar%C3%AAncia"
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-bold sm:text-base">{siteConfig.email}</span>
            </a>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--brand-muted)]">
              Portal revisado e atualizado periodicamente em conformidade com o Estatuto Social.
            </p>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
