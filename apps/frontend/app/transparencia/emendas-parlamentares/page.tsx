import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ClipboardList,
  Download,
  ExternalLink,
  FileSearch,
  FileText,
  Landmark,
  Mail,
  Scale,
  ShieldCheck,
  TableProperties,
} from "lucide-react";

const reportingYears = [
  {
    year: "2020",
    status: "A validar",
    guidance: "Publicar os valores recebidos ou declaração formal de inexistência de recebimento no exercício.",
  },
  {
    year: "2021",
    status: "A validar",
    guidance: "Publicar os valores recebidos ou declaração formal de inexistência de recebimento no exercício.",
  },
  {
    year: "2022",
    status: "A validar",
    guidance: "Publicar os valores recebidos ou declaração formal de inexistência de recebimento no exercício.",
  },
  {
    year: "2023",
    status: "A validar",
    guidance: "Publicar os valores recebidos ou declaração formal de inexistência de recebimento no exercício.",
  },
  {
    year: "2024",
    status: "A validar",
    guidance: "Publicar os valores recebidos ou declaração formal de inexistência de recebimento no exercício.",
  },
  {
    year: "2025",
    status: "Monitoramento",
    guidance: "Registrar novos recebimentos, instrumentos, execução e prestação de contas.",
  },
  {
    year: "2026",
    status: "Monitoramento",
    guidance: "Registrar novos recebimentos, instrumentos, execução e prestação de contas.",
  },
];

const requiredFields = [
  "Ano de recebimento e data do repasse.",
  "Modalidade, número/código da emenda e autor/parlamentar, quando disponível.",
  "Órgão concedente, instrumento, plataforma e fonte oficial de consulta.",
  "Objeto, finalidade e público beneficiado.",
  "Valor recebido, valor executado, saldo e aplicação dos recursos.",
  "Produtos, serviços ou entregas resultantes da aplicação.",
  "Situação da execução e da prestação de contas.",
  "Documentos comprobatórios, relatórios, notas e links oficiais.",
];

const transparencyFlow = [
  {
    title: "Conferir a origem",
    text: "Validar a emenda em fonte oficial, como Transferegov, Portal da Transparência, órgão concedente ou plataforma pública setorial.",
  },
  {
    title: "Comprovar o recebimento",
    text: "Registrar data, valor, instrumento, conta vinculada quando houver e documento que comprove a entrada do recurso.",
  },
  {
    title: "Explicar a aplicação",
    text: "Informar em linguagem simples em que o recurso foi aplicado e quais bens, serviços ou resultados foram gerados.",
  },
  {
    title: "Atualizar continuamente",
    text: "Manter a página atualizada a cada novo repasse, execução, prestação de contas ou conclusão do projeto.",
  },
];

const officialSources = [
  {
    title: "Portal da Transparência - Emendas",
    text: "Consulta pública para rastrear emendas, autores, beneficiários, valores e execução.",
    href: "https://portaldatransparencia.gov.br/emendas",
  },
  {
    title: "Transferegov.br",
    text: "Fonte para instrumentos, planos de trabalho, repasses, execução e prestação de contas quando aplicável.",
    href: "https://www.gov.br/transferegov/pt-br",
  },
  {
    title: "Mapa Cultural do Ceará",
    text: "Base pública de projetos culturais cadastrados pelo Instituto e informações de execução cultural.",
    href: "https://mapacultural.secult.ce.gov.br/",
  },
];

const internalNextSteps = [
  "Conferir pelo CNPJ se houve recebimento direto de emendas entre 2020 e 2024.",
  "Para cada ano, publicar valores recebidos ou declaração formal de inexistência de recebimento.",
  "Vincular cada valor a instrumento, objeto, plano de trabalho, aplicação e documento comprobatório.",
  "Atualizar a página sempre que houver novo recebimento, pagamento, entrega, relatório ou prestação de contas.",
];

const publicationTemplates = [
  {
    title: "Declaração de inexistência de recebimento",
    description: "Modelo para publicar quando o exercício for conferido e não houver recebimento direto identificado.",
    href: "/documentos/transparencia/modelo-declaracao-inexistencia-emendas.txt",
  },
  {
    title: "Relatório de aplicação de recursos",
    description: "Modelo para detalhar valores recebidos, aplicação, entregas, evidências e situação da prestação de contas.",
    href: "/documentos/transparencia/modelo-relatorio-aplicacao-emendas.txt",
  },
  {
    title: "Planilha de dados das emendas",
    description: "Estrutura CSV para organizar ano, modalidade, autor, órgão, objeto, valor, aplicação e status.",
    href: "/documentos/transparencia/modelo-emendas-parlamentares.csv",
  },
  {
    title: "Checklist de publicação",
    description: "Lista de conferência para validar fontes, documentos, valores, declarações e atualizações futuras.",
    href: "/documentos/transparencia/checklist-publicacao-emendas.csv",
  },
];

const legalReferences = [
  {
    icon: Scale,
    title: "ADPF 854 / STF",
    text: "Determina transparência e rastreabilidade das emendas, incluindo valores recebidos por ONGs e entidades do terceiro setor.",
    href: "https://noticias-stf-wp-prd.s3.sa-east-1.amazonaws.com/wp-content/uploads/wpallimport/uploads/2024/12/02145405/ADPF-854-DECISAO-INTERLOCUTORIA-.pdf",
  },
  {
    icon: Landmark,
    title: "Orientação do MinC",
    text: "Orienta OSCs/ONGs beneficiárias de emendas destinadas ao MinC a publicarem valores recebidos, aplicação e conversão dos recursos.",
    href: "https://www.gov.br/cultura/pt-br/assuntos/noticias/ongs-oscs-beneficiarias-de-emendas-parlamentares-destinadas-ao-minc-deverao-publicar-os-valores-recebidos-em-seus-sites",
  },
  {
    icon: ShieldCheck,
    title: "Lei 13.019/2014",
    text: "Estabelece regras de transparência para parcerias entre administração pública e organizações da sociedade civil.",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2014/lei/l13019.htm",
  },
  {
    icon: FileSearch,
    title: "Lei 12.527/2011",
    text: "Lei de Acesso à Informação, aplicável à publicidade da parcela de recursos públicos recebidos e sua destinação.",
    href: "https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12527.htm",
  },
];

const summaryCards = [
  {
    label: "Registros publicados",
    value: "0",
    note: "Aguardando validação documental antes da publicação de valores.",
  },
  {
    label: "Período mínimo",
    value: "2020-2024",
    note: "Exigência indicada na decisão do STF e orientação do MinC.",
  },
  {
    label: "Atualização",
    value: "15/06/2026",
    note: "Estrutura criada para alimentação dos dados reais.",
  },
];

const amendmentRecords: Array<{
  year: string;
  modality: string;
  amendment: string;
  author: string;
  agency: string;
  object: string;
  received: string;
  application: string;
  status: string;
}> = [];

export default function ParliamentaryAmendmentsTransparencyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <header className="border-b border-[var(--brand-border)] bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <PublicBrand />
          <div className="flex items-center gap-3">
            <Link
              href="/transparencia"
              className="hidden rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:inline-flex"
            >
              Transparência
            </Link>
            <Link
              href="/contato"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Solicitar informação
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

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
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Emendas Parlamentares</p>
              <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
                Valores recebidos, aplicação dos recursos e rastreabilidade pública.
              </h1>
            </div>
            <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
              <p>
                Esta página foi criada para reunir, em linguagem clara, as informações exigidas para OSCs/ONGs e entidades
                do terceiro setor beneficiárias de emendas parlamentares.
              </p>
              <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
                Status atual: estrutura publicada e pronta para alimentação. Os valores somente devem ser exibidos após
                validação documental pela diretoria, contabilidade e responsáveis pela prestação de contas.
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

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="/documentos/transparencia/modelo-emendas-parlamentares.csv"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Baixar modelo CSV
              <Download size={17} />
            </a>
            <a
              href="https://www.gov.br/cultura/pt-br/assuntos/noticias/ongs-oscs-beneficiarias-de-emendas-parlamentares-destinadas-ao-minc-deverao-publicar-os-valores-recebidos-em-seus-sites"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
            >
              Ver orientação do MinC
              <ExternalLink size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Relação pública</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Tabela de emendas recebidas pelo Instituto.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                Quando houver dados validados, cada registro deve demonstrar origem, valor, aplicação, resultado e situação
                da prestação de contas.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-4 py-3 text-sm font-bold text-[var(--brand-teal)]">
              <TableProperties size={18} />
              Dados em validação
            </span>
          </div>

          <div className="mt-8 overflow-hidden rounded-lg border border-[var(--brand-border)]">
            <div className="overflow-x-auto">
              <table className="min-w-[1120px] w-full border-collapse bg-white text-left text-sm">
                <thead className="bg-[var(--brand-tint)] text-xs uppercase text-[var(--brand-teal)]">
                  <tr>
                    <th className="px-4 py-4 font-bold">Ano</th>
                    <th className="px-4 py-4 font-bold">Modalidade</th>
                    <th className="px-4 py-4 font-bold">Emenda</th>
                    <th className="px-4 py-4 font-bold">Autor</th>
                    <th className="px-4 py-4 font-bold">Órgão</th>
                    <th className="px-4 py-4 font-bold">Objeto</th>
                    <th className="px-4 py-4 font-bold">Valor recebido</th>
                    <th className="px-4 py-4 font-bold">Aplicação</th>
                    <th className="px-4 py-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {amendmentRecords.length > 0 ? (
                    amendmentRecords.map((record) => (
                      <tr key={`${record.year}-${record.amendment}`} className="border-t border-[var(--brand-border)]">
                        <td className="px-4 py-4 font-semibold">{record.year}</td>
                        <td className="px-4 py-4">{record.modality}</td>
                        <td className="px-4 py-4">{record.amendment}</td>
                        <td className="px-4 py-4">{record.author}</td>
                        <td className="px-4 py-4">{record.agency}</td>
                        <td className="px-4 py-4">{record.object}</td>
                        <td className="px-4 py-4 font-semibold">{record.received}</td>
                        <td className="px-4 py-4">{record.application}</td>
                        <td className="px-4 py-4">{record.status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr className="border-t border-[var(--brand-border)]">
                      <td colSpan={9} className="px-4 py-10 text-center">
                        <div className="mx-auto max-w-2xl">
                          <ClipboardList className="mx-auto text-[var(--brand-teal)]" size={36} />
                          <p className="mt-4 text-lg font-bold text-[var(--brand-text)]">Nenhum registro validado publicado ainda.</p>
                          <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
                            A tabela deve ser preenchida assim que os dados oficiais forem confirmados. Se não houver
                            recebimento em algum exercício, recomenda-se publicar declaração formal de inexistência.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Modelos para publicação</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Arquivos de apoio para preencher a transparência.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Os modelos abaixo ajudam a padronizar a análise interna antes da publicação. Depois de preenchidos,
              revisados e assinados, os documentos finais devem ser convertidos em PDF e publicados nesta página.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {publicationTemplates.map((template) => (
              <a
                key={template.href}
                href={template.href}
                className="flex flex-col justify-between rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 transition hover:border-[var(--brand-teal)] hover:bg-white"
              >
                <span>
                  <FileText className="text-[var(--brand-teal)]" size={28} />
                  <h3 className="mt-4 text-lg font-bold text-[var(--brand-text)]">{template.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{template.description}</p>
                </span>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)]">
                  Baixar modelo
                  <Download size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Cobertura por exercício</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Declarações e publicações por ano.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A exigência alcança valores recebidos de 2020 a 2024 e recebimentos futuros. Cada ano deve conter valores
              publicados ou declaração formal de inexistência, quando aplicável.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {reportingYears.map((year) => (
              <article key={year.year} className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-3xl font-bold text-[var(--brand-teal)]">{year.year}</p>
                  <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                    {year.status}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[var(--brand-muted)]">{year.guidance}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Fontes de verificação</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Onde validar os dados antes de publicar.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A publicação deve partir de fontes oficiais e documentos internos conferidos. Isso reduz risco de erro,
              melhora a rastreabilidade e facilita a conferência por órgãos de controle, parceiros e cidadãos.
            </p>
            <a
              href="/documentos/transparencia/checklist-publicacao-emendas.csv"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Baixar checklist de publicação
              <Download size={17} />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {officialSources.map((source) => (
              <a
                key={source.href}
                href={source.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 transition hover:border-[var(--brand-teal)] hover:bg-white"
              >
                <FileSearch className="text-[var(--brand-teal)]" size={26} />
                <h3 className="mt-4 text-lg font-bold text-[var(--brand-text)]">{source.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{source.text}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)]">
                  Acessar fonte
                  <ArrowUpRight size={16} />
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Landmark className="text-[var(--brand-teal)]" size={34} />
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              Próximas ações para completar a conformidade.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A página já está pronta para receber os dados. O próximo passo administrativo é validar os exercícios,
              confirmar os valores e anexar as evidências correspondentes.
            </p>
          </div>

          <div className="grid gap-3">
            {internalNextSteps.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-lg border border-[var(--brand-border)] bg-white p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-orange-light)] text-sm font-bold text-[var(--brand-text)]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-semibold leading-6 text-[var(--brand-text)]">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-light)]">Campos obrigatórios</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              O que cada registro deve permitir verificar.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-light-text)]">
              A transparência precisa ser suficiente para controle social: origem, destino, execução e resultado do gasto.
            </p>
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
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Fluxo de atualização</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Como manter a página em conformidade.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {transparencyFlow.map((item, index) => (
              <article key={item.title} className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-teal)] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <h3 className="mt-5 text-lg font-bold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Base normativa</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Referências usadas para organizar esta página.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {legalReferences.map((reference) => {
              const Icon = reference.icon;

              return (
                <a
                  key={reference.title}
                  href={reference.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg border border-[var(--brand-border)] bg-white p-5 transition hover:border-[var(--brand-teal)]"
                >
                  <Icon className="text-[var(--brand-teal)]" size={28} />
                  <h3 className="mt-4 text-lg font-bold text-[var(--brand-text)]">{reference.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{reference.text}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)]">
                    Acessar fonte
                    <ArrowUpRight size={16} />
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <FileText className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-2xl font-bold">Solicitação de informações sobre emendas</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Pedidos, correções ou complementações sobre emendas parlamentares podem ser encaminhados ao canal oficial do
              Instituto Incentive.
            </p>
          </div>

          <a
            href="mailto:contato@institutoincentive.org.br?subject=Solicita%C3%A7%C3%A3o%20sobre%20emendas%20parlamentares"
            className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
          >
            <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
            <span className="break-all text-sm font-semibold sm:text-base">contato@institutoincentive.org.br</span>
          </a>
        </div>
      </section>
    </main>
  );
}
