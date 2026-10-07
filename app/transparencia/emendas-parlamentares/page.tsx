import type { Metadata } from "next";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  ArrowUpRight,
  ClipboardList,
  Download,
  Mail,
  TableProperties,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Emendas Parlamentares",
  description:
    "Declarações anuais e prestação de contas pública sobre o recebimento e execução de emendas parlamentares pelo Instituto Incentive.",
  path: "/transparencia/emendas-parlamentares",
});

const annualDeclarations = [
  {
    year: "2025",
    number: "006/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2025.pdf",
  },
  {
    year: "2024",
    number: "005/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2024.pdf",
  },
  {
    year: "2023",
    number: "004/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2023.pdf",
  },
  {
    year: "2022",
    number: "003/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2022.pdf",
  },
  {
    year: "2021",
    number: "002/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2021.pdf",
  },
  {
    year: "2020",
    number: "001/2026",
    href: "/documentos/transparencia/emendas-parlamentares/declaracao-inexistencia-emendas-2020.pdf",
  },
];

const amendmentRecords: Array<{
  year: string;
  source: string;
  object: string;
  received: string;
  application: string;
  status: string;
}> = [];

export default function ParliamentaryAmendmentsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Prestação de Contas Pública
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Emendas Parlamentares.
            </h1>
          </div>
          <div className="space-y-4 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Esta página consolida as informações sobre o recebimento, destinação e execução de <strong>emendas parlamentares federais, estaduais e municipais</strong> destinadas ao Instituto Incentive.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Nos exercícios de <strong>2020 a 2025</strong>, o valor total recebido a título de emendas foi de <strong>R$ 0,00</strong>, formalizado mediante declarações anuais emitidas pela Diretoria Executiva.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Tabela Consolidada de Execução</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">Histórico de Recursos Públicos por Emenda</h2>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)]">
              <TableProperties size={16} />
              Transparência Ativa
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-xl border border-[var(--brand-border)] shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-[960px] w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-[var(--brand-tint)] text-xs uppercase text-[var(--brand-teal)]">
                  <tr>
                    <th className="px-5 py-4 font-extrabold">Exercício</th>
                    <th className="px-5 py-4 font-extrabold">Parlamentar / Origem</th>
                    <th className="px-5 py-4 font-extrabold">Objeto do Plano de Trabalho</th>
                    <th className="px-5 py-4 font-extrabold">Valor Repassado</th>
                    <th className="px-5 py-4 font-extrabold">Destinação</th>
                    <th className="px-5 py-4 font-extrabold">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {amendmentRecords.length > 0 ? (
                    amendmentRecords.map((record) => (
                      <tr key={`${record.year}-${record.source}`} className="border-t border-[var(--brand-border-soft)]">
                        <td className="px-5 py-4 font-bold">{record.year}</td>
                        <td className="px-5 py-4">{record.source}</td>
                        <td className="px-5 py-4">{record.object}</td>
                        <td className="px-5 py-4 font-bold">{record.received}</td>
                        <td className="px-5 py-4">{record.application}</td>
                        <td className="px-5 py-4">{record.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-[var(--brand-border-soft)]">
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <ClipboardList className="mx-auto text-[var(--brand-teal)]" size={40} />
                        <p className="mt-4 text-base font-extrabold text-[var(--brand-text)]">
                          Não houve recebimento de emendas parlamentares nos exercícios de 2020 a 2025.
                        </p>
                        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-[var(--brand-muted)]">
                          A inexistência de repasses foi atestada individualmente por meio de declarações anuais registradas.
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

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Declarações Oficiais em PDF</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Documentos por Exercício Anual</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Consulte e faça o download das declarações formais de inexistência de emendas parlamentares emitidas pelo Instituto.
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {annualDeclarations.map((dec) => (
              <article key={dec.year} className="flex flex-col justify-between rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-extrabold text-[var(--brand-teal)]">{dec.year}</span>
                    <span className="rounded-lg bg-[var(--brand-tint)] px-3 py-1 text-xs font-bold uppercase text-[var(--brand-teal)]">
                      Publicada
                    </span>
                  </div>
                  <h3 className="mt-3 text-base font-extrabold text-[var(--brand-text)]">Declaração nº {dec.number}</h3>
                  <p className="mt-2 text-sm text-[var(--brand-muted)]">
                    Atesta a não destinação ou recebimento de emendas parlamentares no exercício.
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 border-t border-[var(--brand-border-soft)] pt-4">
                  <TrackedAnchor
                    href={dec.href}
                    target="_blank"
                    rel="noreferrer"
                    eventName="document_open"
                    eventProperties={{ area: "parliamentary_amendments", year: dec.year, document: dec.number }}
                    className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
                  >
                    Visualizar PDF
                    <ArrowUpRight size={14} />
                  </TrackedAnchor>
                  <TrackedAnchor
                    href={dec.href}
                    download
                    eventName="document_download"
                    eventProperties={{ area: "parliamentary_amendments", year: dec.year, document: dec.number }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
                  >
                    Baixar
                    <Download size={14} />
                  </TrackedAnchor>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-extrabold">Canal de Transparência sobre Emendas</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Para dúvidas, auditorias ou solicitações relacionadas a emendas e transferências, envie uma mensagem para o canal oficial.
            </p>
          </div>
          <TrackedAnchor
            href="mailto:contato@institutoincentive.org.br?subject=Solicita%C3%A7%C3%A3o%20sobre%20emendas%20parlamentares"
            eventName="contact_channel_click"
            eventProperties={{ channel: "email", page: "parliamentary_amendments" }}
            className="flex items-center gap-4 rounded-xl border border-white/15 bg-white/10 p-5 text-white transition hover:bg-white/15"
          >
            <Mail className="shrink-0 text-[var(--brand-orange-light)]" size={24} />
            <span className="break-all text-sm font-bold sm:text-base">{siteConfig.email}</span>
          </TrackedAnchor>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
