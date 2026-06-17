import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Download,
  FileCheck2,
  FileText,
  Landmark,
  Mail,
  Scale,
  TableProperties,
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

const summaryCards = [
  {
    label: "Período de cobertura",
    value: "2020-2026",
    note: "Inclui o período mínimo exigido e os exercícios futuros.",
  },
  {
    label: "Registros publicados",
    value: "0",
    note: "Aguardando conferência documental antes da publicação de valores.",
  },
  {
    label: "Situação atual",
    value: "Em validação",
    note: "Estrutura pronta para alimentar valores, aplicação e documentos comprobatórios.",
  },
];

const reportingYears = [
  "2020",
  "2021",
  "2022",
  "2023",
  "2024",
  "2025",
  "2026",
];

const requiredFields = [
  "Ano, data do recebimento e identificação do instrumento.",
  "Modalidade, número/código da emenda e autor/parlamentar, quando houver.",
  "Órgão concedente, plataforma pública de referência e fonte oficial de conferência.",
  "Objeto, finalidade, público beneficiado e território atendido.",
  "Valor recebido, valor executado, saldo e aplicação dos recursos.",
  "Produtos, serviços, entregas ou bens gerados com os recursos.",
  "Situação da execução, da prestação de contas e dos documentos comprobatórios.",
  "Canal para solicitação de informações, correções ou complementos.",
];

const publicationFlow = [
  "Conferir se houve recebimento direto pelo CNPJ do Instituto em cada exercício.",
  "Publicar valor recebido ou declaração de inexistência de recebimento para o ano conferido.",
  "Detalhar em que o recurso foi aplicado e quais entregas foram geradas.",
  "Anexar evidências, relatórios, links oficiais e situação da prestação de contas.",
  "Atualizar a página sempre que houver novo repasse, pagamento, entrega ou prestação de contas.",
];

const legalBases = [
  {
    icon: Scale,
    title: "ADPF 854 / STF",
    text: "Exige publicidade e rastreabilidade da execução de emendas parlamentares.",
  },
  {
    icon: Landmark,
    title: "Lei 13.019/2014",
    text: "Define regras de transparência para parcerias entre poder público e organizações da sociedade civil.",
  },
  {
    icon: FileCheck2,
    title: "Decreto 8.726/2016",
    text: "Regulamenta procedimentos do MROSC e reforça a divulgação de informações sobre parcerias.",
  },
  {
    icon: FileText,
    title: "Lei 12.527/2011",
    text: "Orienta a publicidade da parcela de recursos públicos recebidos e sua destinação.",
  },
];

const templates = [
  {
    title: "Modelo de declaração de inexistência",
    description: "Para publicar quando um exercício for conferido e não houver recebimento direto identificado.",
    href: "/documentos/transparencia/modelo-declaracao-inexistencia-emendas.txt",
  },
  {
    title: "Modelo de relatório de aplicação",
    description: "Para registrar valor recebido, objeto, execução, entregas e prestação de contas.",
    href: "/documentos/transparencia/modelo-relatorio-aplicacao-emendas.txt",
  },
  {
    title: "Planilha de controle das emendas",
    description: "Estrutura CSV para organizar dados anuais, valores, fontes e situação documental.",
    href: "/documentos/transparencia/modelo-emendas-parlamentares.csv",
  },
  {
    title: "Checklist de publicação",
    description: "Lista de conferência antes de publicar ou atualizar informações no site.",
    href: "/documentos/transparencia/checklist-publicacao-emendas.csv",
  },
];

const verificationSources = [
  {
    title: "Portal da Transparência",
    href: "https://portaldatransparencia.gov.br/emendas",
  },
  {
    title: "Transferegov.br",
    href: "https://www.gov.br/transferegov/pt-br",
  },
  {
    title: "Mapa Cultural do Ceará",
    href: "https://mapacultural.secult.ce.gov.br/",
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

      <section className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <Link
            href="/transparencia"
            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
          >
            <ArrowLeft size={17} />
            Voltar para Transparência
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
                Emendas Parlamentares
              </p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Publicidade dos valores recebidos, aplicação dos recursos e prestação de contas.
              </h1>
            </div>
            <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
              <p>
                Esta página foi organizada para cumprir as exigências de transparência aplicáveis às organizações da
                sociedade civil quando houver recebimento de recursos públicos por emendas parlamentares.
              </p>
              <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
                O Instituto deve publicar valores recebidos, informar em que foram aplicados, registrar entregas e manter
                documentos comprobatórios acessíveis ao controle social.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
          <div className="grid gap-5 md:grid-cols-3">
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

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Tabela pública</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Relação de emendas recebidas pelo Instituto.</h2>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                Após validação, cada registro deve demonstrar origem, objeto, valor, aplicação, entregas e situação da
                prestação de contas.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-4 py-3 text-sm font-bold text-[var(--brand-teal)]">
              <TableProperties size={18} />
              Dados em conferência
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-[var(--brand-border)]">
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
                          Nenhum valor validado publicado até o momento.
                        </p>
                        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--brand-muted)]">
                          Após a conferência documental, esta tabela deve receber os valores confirmados ou as declarações
                          de inexistência de recebimento para cada exercício.
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
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Cobertura anual</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Cada exercício precisa ter posição documentada.</h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportingYears.map((year) => (
              <article key={year} className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
                <p className="text-3xl font-bold text-[var(--brand-teal)]">{year}</p>
                <p className="mt-4 text-sm leading-6 text-[var(--brand-muted)]">
                  Publicar valores recebidos no ano ou declaração formal de inexistência após conferência.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-light)]">Campos mínimos</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              O que deve aparecer para atender transparência e controle social.
            </h2>
          </div>

          <div className="grid gap-3">
            {requiredFields.map((field) => (
              <div key={field} className="flex items-start gap-3 rounded-lg border border-white/[0.12] bg-white/[0.07] p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-orange-light)]" size={18} />
                <p className="text-sm font-medium leading-6 text-[var(--brand-light-surface)]">{field}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Fluxo de atualização</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Rotina prática para manter a página em conformidade.</h2>
          </div>
          <div className="grid gap-3">
            {publicationFlow.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-orange-light)] text-sm font-bold text-[var(--brand-text)]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-6 text-[var(--brand-text)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Modelos internos</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Arquivos de apoio para preenchimento e conferência.</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {templates.map((template) => (
              <a
                key={template.href}
                href={template.href}
                className="rounded-lg border border-[var(--brand-border)] bg-white p-5 transition hover:border-[var(--brand-teal)]"
              >
                <FileText className="text-[var(--brand-teal)]" size={28} />
                <h3 className="mt-4 text-lg font-bold text-[var(--brand-text)]">{template.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{template.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)]">
                  Baixar modelo
                  <Download size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Base de conformidade</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Referências legais que orientam a publicação.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              O objetivo da página é demonstrar publicidade, rastreabilidade, aplicação dos recursos e prestação de contas
              em linguagem clara.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            {legalBases.map((base) => {
              const Icon = base.icon;

              return (
                <article key={base.title} className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5">
                  <Icon className="text-[var(--brand-teal)]" size={28} />
                  <h3 className="mt-4 text-lg font-bold">{base.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{base.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold">Fontes públicas de conferência</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              A apuração dos dados deve ser feita em fontes oficiais e documentos internos validados.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {verificationSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              >
                {source.title}
                <ArrowUpRight size={16} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <h2 className="text-2xl font-bold">Solicitação de informações</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">
              Pedidos, correções ou complementações sobre emendas parlamentares podem ser encaminhados ao canal oficial.
            </p>
          </div>
          <a
            href="mailto:contato@institutoincentive.org.br?subject=Solicita%C3%A7%C3%A3o%20sobre%20emendas%20parlamentares"
            className="flex items-center gap-4 rounded-lg border border-white/15 bg-white/10 p-4 text-white transition hover:bg-white/15"
          >
            <Mail className="shrink-0 text-[var(--brand-orange-light)]" size={22} />
            <span className="break-all text-sm font-semibold sm:text-base">contato@institutoincentive.org.br</span>
          </a>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
