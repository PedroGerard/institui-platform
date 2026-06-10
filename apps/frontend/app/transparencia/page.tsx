import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Download,
  FileSearch,
  FileText,
  Handshake,
  Landmark,
  Mail,
  Scale,
  ShieldCheck,
  Users,
} from "lucide-react";

const documentGroups = [
  {
    icon: FileSearch,
    title: "Documentos institucionais",
    description: "Base jurídica e registros que identificam a organização.",
    items: ["Estatuto Social", "Ata de eleição e posse da diretoria", "CNPJ e certidões", "Regimento interno"],
  },
  {
    icon: Users,
    title: "Governança",
    description: "Composição, mandatos, responsabilidades e controles internos.",
    items: ["Diretoria Executiva", "Conselho Fiscal", "Conselhos e comissões", "Organograma institucional"],
  },
  {
    icon: Landmark,
    title: "Relatórios e contas",
    description: "Registro anual das atividades, finanças e resultados alcançados.",
    items: ["Relatório de atividades", "Demonstrações contábeis", "Parecer do Conselho Fiscal", "Relatório de impacto"],
  },
  {
    icon: ShieldCheck,
    title: "Políticas e integridade",
    description: "Regras que orientam conduta, dados pessoais e relacionamento com parceiros.",
    items: ["Código de Conduta", "Política de Transparência", "Política de Privacidade", "Canal de integridade"],
  },
];

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

const pendingTransparencyDocuments = ["Relatório de Atividades 2026"];

const totalPublishedDocuments = publishedDocumentSections.reduce(
  (total, section) => total + section.documents.length,
  0,
);

const publicPartnershipChecklist = [
  "Data de assinatura e identificação do instrumento de parceria.",
  "Órgão público responsável pela parceria.",
  "Nome da organização, CNPJ e objeto do projeto.",
  "Valor total, valores liberados e origem dos recursos, quando houver.",
  "Situação da prestação de contas, com prazos e resultado conclusivo.",
  "Remuneração de equipe paga com recursos da parceria, quando aplicável.",
];

const projectLinks = [
  {
    title: "Sons do Sertão",
    href: "https://mapacultural.secult.ce.gov.br/projeto/7510/",
  },
  {
    title: "Beleza Criativa",
    href: "https://mapacultural.secult.ce.gov.br/projeto/7429/",
  },
  {
    title: "Conexão Profissional",
    href: "https://mapacultural.secult.ce.gov.br/projeto/7512/",
  },
  {
    title: "I Fórum de Lideranças Associativas",
    href: "https://mapacultural.secult.ce.gov.br/projeto/6738/",
  },
  {
    title: "Workshop para Fortalecimento Institucional do Terceiro Setor",
    href: "https://mapacultural.secult.ce.gov.br/projeto/6605/",
  },
];

const legalReferences = [
  {
    icon: Scale,
    title: "MROSC - Lei 13.019/2014",
    text: "Orienta a divulgação de parcerias celebradas com a administração pública e as informações mínimas de cada instrumento.",
  },
  {
    icon: Landmark,
    title: "Lei de Acesso à Informação",
    text: "Quando houver recursos públicos, reforça a publicidade da parcela recebida e da destinação desses recursos.",
  },
  {
    icon: ShieldCheck,
    title: "LGPD",
    text: "Exige cuidado com dados pessoais coletados por formulários, inscrições, comunicação e documentos publicados.",
  },
  {
    icon: BookOpen,
    title: "Acessibilidade digital",
    text: "Boas práticas de eMAG e WCAG orientam conteúdo compreensível, navegável e acessível ao maior número de pessoas.",
  },
];

export default function TransparencyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <header className="border-b border-[var(--brand-border)] bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <PublicBrand />
          <div className="flex items-center gap-3">
            <Link
              href="/areas-de-atuacao"
              className="hidden rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] lg:inline-flex"
            >
              Áreas de atuação
            </Link>
            <Link
              href="/projetos"
              className="hidden rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:inline-flex"
            >
              Projetos
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

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Transparência</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Governança, documentos e prestação de contas em linguagem clara.
            </h1>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Esta área organiza os documentos institucionais, relatórios, políticas e informações de parcerias do
              Instituto Incentive. A estrutura foi pensada para facilitar consulta pública, fiscalização social e
              atualização contínua.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Status: {totalPublishedDocuments} documentos oficiais já estão disponíveis para consulta pública. Novos
              relatórios e políticas podem ser acrescentados conforme validação da diretoria.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Documentos publicados</p>
              <h2 className="mt-3 text-3xl font-bold text-[var(--brand-text)] sm:text-4xl">
                Acervo inicial de transparência institucional.
              </h2>
              <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
                Os anexos abaixo foram organizados por finalidade para facilitar consulta, verificação e prestação de
                informações ao público.
              </p>
            </div>
            <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-4 py-3 text-sm font-bold text-[var(--brand-teal)]">
              <FileText size={18} />
              {totalPublishedDocuments} PDFs publicados
            </span>
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
                    <a
                      key={document.href}
                      href={document.href}
                      target="_blank"
                      rel="noreferrer"
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
                    </a>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-dashed border-[var(--brand-border-strong)] bg-white p-5">
            <p className="text-sm font-bold uppercase text-[var(--brand-muted)]">Em organização</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {pendingTransparencyDocuments.map((document) => (
                <span key={document} className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-sm font-semibold text-[var(--brand-orange-dark)]">
                  {document}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          {documentGroups.map((group) => {
            const Icon = group.icon;

            return (
              <article key={group.title} className="rounded-lg border border-[var(--brand-border)] bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                  <Icon size={22} />
                </div>
                <h2 className="mt-5 text-lg font-bold text-[var(--brand-text)]">{group.title}</h2>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{group.description}</p>
                <div className="mt-5 grid gap-2">
                  {group.items.map((item) => (
                    <div key={item} className="flex items-start gap-2 text-sm text-[var(--brand-muted)]">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={16} />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <span className="mt-5 inline-flex rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                  Base documental
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-light)]">Parcerias públicas</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Quando houver recurso público, a parceria precisa aparecer de forma objetiva.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-light-text)]">
              A aba deve permitir que qualquer pessoa localize o instrumento, entenda o objeto, veja valores, acompanhe a
              prestação de contas e saiba como pedir informações adicionais.
            </p>
          </div>

          <div className="grid gap-3">
            {publicPartnershipChecklist.map((item, index) => (
              <div key={item} className="flex gap-4 rounded-lg border border-white/[0.12] bg-white/[0.07] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-orange-light)] text-sm font-bold text-[var(--brand-text)]">
                  {index + 1}
                </span>
                <p className="pt-1 text-sm font-medium leading-6 text-[var(--brand-light-surface)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <Handshake className="text-[var(--brand-teal)]" size={34} />
            <h2 className="mt-4 text-3xl font-bold">Projetos já publicados em plataforma pública.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Enquanto os relatórios internos são organizados, os projetos cadastrados no Mapa Cultural do Ceará ficam
              reunidos aqui para consulta e verificação.
            </p>
            <Link
              href="/projetos"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Ver página de projetos
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-3">
            {projectLinks.map((project) => (
              <a
                key={project.href}
                href={project.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
              >
                <span className="text-sm font-semibold leading-6">{project.title}</span>
                <ArrowUpRight className="shrink-0 text-[var(--brand-teal)]" size={18} />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Referências de conformidade</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              O que orienta a organização desta página.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {legalReferences.map((reference) => {
              const Icon = reference.icon;

              return (
                <article key={reference.title} className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
                  <Icon className="text-[var(--brand-teal)]" size={28} />
                  <h3 className="mt-4 text-lg font-bold">{reference.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{reference.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <Building2 className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-2xl font-bold">Solicitação de informações</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Para documentos ainda não publicados, dúvidas sobre parcerias ou pedidos de atualização, use o canal oficial
              de contato do Instituto.
            </p>
          </div>

          <div className="grid gap-3">
            <a
              href="mailto:contato@institutoincentive.org.br?subject=Solicitação%20de%20informações%20-%20Transparência"
              className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-semibold sm:text-base">contato@institutoincentive.org.br</span>
            </a>
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-muted)]">
              Última organização da página: 03 de junho de 2026
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
