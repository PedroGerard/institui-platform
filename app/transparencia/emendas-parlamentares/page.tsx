import type { Metadata } from "next";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import {
  ArrowLeft,
  ArrowUpRight,
  ClipboardList,
  Download,
  Mail,
  TableProperties,
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Emendas Parlamentares",
  description:
    "Posicao documental do Instituto Incentive sobre emendas parlamentares e transferencias especiais, com declaracoes anuais de 2020 a 2025.",
  path: "/transparencia/emendas-parlamentares",
});

const summaryCards = [
  {
    label: "Período de cobertura",
    value: "2020-2025",
    note: "Exercícios com posição anual documentada e publicada.",
  },
  {
    label: "Documentos anuais",
    value: "6",
    note: "Documentos anuais de inexistência de recebimento disponíveis para consulta.",
  },
  {
    label: "Situação atual",
    value: "Sem recebimento",
    note: "Não houve identificação de emendas parlamentares ou transferências especiais recebidas.",
  },
];

const annualDeclarations = [
  {
    year: "2020",
    number: "001/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2020.pdf",
  },
  {
    year: "2021",
    number: "002/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2021.pdf",
  },
  {
    year: "2022",
    number: "003/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2022.pdf",
  },
  {
    year: "2023",
    number: "004/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2023.pdf",
  },
  {
    year: "2024",
    number: "005/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2024.pdf",
  },
  {
    year: "2025",
    number: "006/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2025.pdf",
  },
];

const amendmentRecords: Array<{
  year: string;
  source: string;
  object: string;
  received: string;
  application: string;
  status: string;
}> = annualDeclarations.map((declaration) => ({
  year: declaration.year,
  source: "Não houve recebimento",
  object: "—",
  received: "R$ 0,00",
  application: "Não aplicável",
  status: "Declaração publicada",
}));

export default function ParliamentaryAmendmentsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto w-full max-w-7xl px-5 py-14 sm:px-8">
          <Link
            href="/transparencia"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
          >
            <ArrowLeft size={17} />
            Voltar para Transparência
          </Link>

          <div className="mt-8 grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div className="min-w-0">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
                Emendas Parlamentares
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Declarações anuais sobre emendas parlamentares e transferências especiais.
              </h1>
            </div>
            <div className="min-w-0 space-y-5 text-base leading-8 text-[var(--brand-muted)]">
              <p>
                O Instituto Incentive publica nesta seção as declarações anuais referentes ao recebimento de emendas
                parlamentares e transferências especiais nos exercícios de 2020 a 2025.
              </p>
              <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
                Para o período informado, não houve recebimento de recursos dessa natureza pelo CNPJ do Instituto.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid w-full gap-5 md:grid-cols-3">
            {summaryCards.map((card) => (
              <article key={card.label} className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
                <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">{card.label}</p>
                <p className="mt-3 text-3xl font-bold text-[var(--brand-teal)]">{card.value}</p>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{card.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <div className="rounded-lg border border-[var(--brand-border-strong)] bg-[var(--brand-tint)] p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Aviso de Transparência</p>
            <h2 className="mt-3 text-2xl font-bold text-[var(--brand-text)]">
              Inexistência de recebimento declarada para 2020 a 2025.
            </h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-[var(--brand-muted)]">
              <p>
                Até a presente data, o Instituto Incentive de Inovação, Desenvolvimento e Transformação Social não
                recebeu recursos oriundos de emendas parlamentares ou transferências especiais (Emendas PIX) nos
                exercícios de 2020 a 2025, conforme declarações anuais publicadas nesta seção.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0 max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Tabela pública</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Recebimento de emendas por exercício.</h2>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                Nos exercícios de 2020 a 2025, o valor recebido foi R$ 0,00, conforme declarações anuais disponibilizadas
                em PDF.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-4 py-3 text-sm font-bold text-[var(--brand-teal)]">
              <TableProperties size={18} />
              Documentos em PDF
            </span>
          </div>

          <div className="mt-8 w-full overflow-hidden rounded-lg border border-[var(--brand-border)]">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-[var(--brand-tint)] text-xs uppercase text-[var(--brand-teal)]">
                  <tr>
                    <th className="px-4 py-4 font-bold">Ano</th>
                    <th className="px-4 py-4 font-bold">Fonte/Instrumento</th>
                    <th className="px-4 py-4 font-bold">Objeto</th>
                    <th className="px-4 py-4 font-bold">Valor recebido</th>
                    <th className="px-4 py-4 font-bold">Aplicação</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {amendmentRecords.length > 0 ? (
                    amendmentRecords.map((record) => (
                      <tr key={`${record.year}-${record.source}`} className="border-t border-[var(--brand-border)]">
                        <td className="px-4 py-4 font-semibold">{record.year}</td>
                        <td className="px-4 py-4">{record.source}</td>
                        <td className="px-4 py-4">{record.object}</td>
                        <td className="px-4 py-4 font-semibold">{record.received}</td>
                        <td className="px-4 py-4">{record.application}</td>
                        <td className="px-4 py-4">{record.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-[var(--brand-border)]">
                      <td colSpan={6} className="px-4 py-10 text-center">
                        <ClipboardList className="mx-auto text-[var(--brand-teal)]" size={36} />
                        <p className="mt-4 text-lg font-bold text-[var(--brand-text)]">
                          Não houve recebimento declarado para o período informado.
                        </p>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--brand-muted)]">
                          A inexistência de recebimento foi formalizada por meio de declarações anuais.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="min-w-0 max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Cobertura anual</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Declarações anuais disponíveis para consulta.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Cada documento formaliza a inexistência de recebimento de emendas parlamentares ou transferências
              especiais pelo Instituto Incentive no respectivo exercício.
            </p>
          </div>

          <div className="mt-10 grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
            {annualDeclarations.map((declaration) => (
              <article key={declaration.year} className="min-w-0 rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-3xl font-bold text-[var(--brand-teal)]">{declaration.year}</p>
                    <p className="mt-2 text-sm font-bold text-[var(--brand-text)]">
                      Declaração nº {declaration.number}
                    </p>
                  </div>
                  <span className="rounded-lg bg-[var(--brand-tint)] px-3 py-2 text-xs font-bold text-[var(--brand-teal)]">
                    Publicada
                  </span>
                </div>
                <div className="mt-5 space-y-3 text-sm leading-6 text-[var(--brand-muted)]">
                  <p>
                    <strong className="text-[var(--brand-text)]">Situação:</strong> Não houve recebimento de emendas
                    parlamentares.
                  </p>
                  <p>
                    <strong className="text-[var(--brand-text)]">Última atualização:</strong> 19/06/2026
                  </p>
                  <p>
                    <strong className="text-[var(--brand-text)]">Responsável:</strong> Pedro Gerard de Souza Jucá -
                    Diretor Executivo
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <TrackedAnchor
                    href={declaration.href}
                    target="_blank"
                    rel="noreferrer"
                    eventName="document_open"
                    eventProperties={{ area: "parliamentary_amendments", year: declaration.year, document: declaration.number }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)] sm:w-auto"
                  >
                    Visualizar PDF
                    <ArrowUpRight size={16} />
                  </TrackedAnchor>
                  <TrackedAnchor
                    href={declaration.href}
                    download
                    eventName="document_download"
                    eventProperties={{ area: "parliamentary_amendments", year: declaration.year, document: declaration.number }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:w-auto"
                  >
                    Baixar PDF
                    <Download size={16} />
                  </TrackedAnchor>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">Solicitação de informações</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">
              Pedidos, correções ou complementações sobre emendas parlamentares podem ser encaminhados ao canal oficial.
            </p>
          </div>
          <TrackedAnchor
            href="mailto:contato@institutoincentive.org.br?subject=Solicita%C3%A7%C3%A3o%20sobre%20emendas%20parlamentares"
            eventName="contact_channel_click"
            eventProperties={{ channel: "email", page: "parliamentary_amendments" }}
            className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4 text-white transition hover:bg-white/15"
          >
            <Mail className="shrink-0 text-[var(--brand-orange-light)]" size={22} />
            <span className="break-all text-sm font-semibold sm:text-base">contato@institutoincentive.org.br</span>
          </TrackedAnchor>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
