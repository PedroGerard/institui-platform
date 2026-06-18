import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Building2,
  CalendarDays,
  CheckCircle2,
  Download,
  FileCheck2,
  FileText,
  RefreshCw,
  SearchCheck,
  Landmark,
  ShieldCheck,
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";

const certificationGroups = [
  {
    icon: ShieldCheck,
    title: "Licenças e conformidade",
    description: "Autorizações e certificados que demonstram regularidade de funcionamento.",
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
    icon: FileCheck2,
    title: "Regularidade fiscal e trabalhista",
    description: "Certidões usadas para comprovar regularidade perante órgãos públicos e parceiros.",
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
    icon: Building2,
    title: "Identificação e governança",
    description: "Documentos que confirmam existência formal, estatuto e representação institucional.",
    documents: [
      {
        title: "Comprovante de inscrição e situação cadastral - CNPJ",
        href: "/documentos/transparencia/cartao-cnpj-instituto-incentive.pdf",
      },
      {
        title: "Estatuto Social Reformado - RPJ",
        href: "/documentos/transparencia/estatuto-social-reformado-rpj.pdf",
      },
      {
        title: "Ata de eleição e posse - RPJ",
        href: "/documentos/transparencia/ata-eleicao-posse-rpj.pdf",
      },
    ],
  },
  {
    icon: Landmark,
    title: "Contas e demonstrações",
    description: "Evidências contábeis e documentos que fortalecem prestação de contas institucional.",
    documents: [
      {
        title: "Demonstrações financeiras e notas explicativas",
        href: "/documentos/transparencia/demonstracoes-financeiras-notas-explicativas.pdf",
      },
    ],
  },
];

const recognitionItems = [
  "Projetos culturais publicados em plataforma pública de consulta.",
  "Portal de Transparência estruturado para documentos, emendas, governança e prestação de contas.",
  "Domínio institucional próprio com comunicação oficial pelo institutoincentive.org.br.",
  "Relatório de Atividades 2026 em organização para publicação após validação.",
];

const totalDocuments = certificationGroups.reduce(
  (total, group) => total + group.documents.length,
  0,
);

const pageUpdatedAt = "18 de junho de 2026";

const maintenanceSteps = [
  {
    title: "Conferir validade",
    text: "Revisar certidões, alvarás e documentos com prazo antes de vencimentos ou novas exigências.",
  },
  {
    title: "Validar internamente",
    text: "Confirmar com a diretoria quais documentos podem ser publicados e quais exigem atualização.",
  },
  {
    title: "Publicar versão atual",
    text: "Substituir arquivos vencidos por novas versões e manter nomes claros para consulta pública.",
  },
  {
    title: "Registrar evidências",
    text: "Guardar data de publicação, origem do documento e responsável pela atualização do acervo.",
  },
];

export default function CertificationsAndRecognitionPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
              Certificações e Reconhecimentos
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Evidências públicas de regularidade, governança e compromisso institucional.
            </h1>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Ver Transparência
                <ArrowRight size={18} />
              </Link>
              <a
                href="mailto:contato@institutoincentive.org.br?subject=Atualiza%C3%A7%C3%A3o%20documental%20-%20Certifica%C3%A7%C3%B5es"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              >
                Solicitar atualização
                <ArrowUpRight size={18} />
              </a>
            </div>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Esta área reúne documentos de conformidade, certidões, registros institucionais e evidências públicas que
              ajudam parceiros, órgãos públicos e cidadãos a verificar a atuação do Instituto Incentive.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Os documentos são organizados por categoria e devem ser atualizados sempre que houver nova emissão,
              renovação, reconhecimento público ou validação pela diretoria.
            </p>
            <p className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-orange-soft)] px-4 py-3 text-sm font-bold text-[var(--brand-orange-dark)]">
              <CalendarDays size={18} />
              Página revisada em {pageUpdatedAt}
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-4">
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <Award className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">{totalDocuments}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">documentos comprobatórios publicados</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <ShieldCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">4</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">frentes de regularidade institucional</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <FileText className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">Contínuo</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">processo de atualização e validação</p>
          </article>
          <article className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
            <SearchCheck className="text-[var(--brand-orange-light)]" size={30} />
            <p className="mt-4 text-3xl font-bold">Público</p>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">acesso direto aos arquivos em PDF</p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {certificationGroups.map((group) => {
            const Icon = group.icon;

            return (
              <article key={group.title} className="rounded-lg border border-[var(--brand-border)] bg-white shadow-sm">
                <div className="p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                    <Icon size={24} />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold">{group.title}</h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{group.description}</p>
                </div>

                <div className="border-t border-[var(--brand-border)]">
                  {group.documents.map((document) => (
                    <a
                      key={document.href}
                      href={document.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center justify-between gap-4 border-b border-[var(--brand-border-soft)] px-6 py-4 text-[var(--brand-text)] transition last:border-b-0 hover:bg-[var(--brand-surface)]"
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
            );
          })}
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Rotina de manutenção</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Como manter certificações e documentos sempre confiáveis.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A página deve ser tratada como um acervo vivo. Sempre que um documento vencer, for renovado ou receber nova
              versão, a publicação precisa ser atualizada para preservar segurança jurídica e confiança pública.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-4">
            {maintenanceSteps.map((step, index) => (
              <article key={step.title} className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-orange-light)] text-sm font-extrabold text-[var(--brand-text)]">
                  {index + 1}
                </div>
                <h3 className="mt-4 text-lg font-bold text-[var(--brand-text)]">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{step.text}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 flex items-start gap-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tint)] p-5">
            <RefreshCw className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={22} />
            <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Recomenda-se revisar esta página ao menos uma vez por mês e sempre antes de enviar documentação para editais,
              parcerias, convênios ou processos de habilitação.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
              Reconhecimentos e evidências públicas
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Itens que fortalecem reputação e confiança institucional.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Esta lista deve crescer conforme novos selos, premiações, registros públicos ou reconhecimentos formais
              forem comprovados e aprovados para divulgação.
            </p>
          </div>

          <div className="grid gap-3">
            {recognitionItems.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Acompanhe também a Transparência.</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Os documentos desta página fazem parte do acervo público de transparência institucional.
            </p>
          </div>
          <Link
            href="/transparencia"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Ver Transparência
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Tem um reconhecimento para incluir?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Envie a comprovação para validação documental antes da publicação.
            </p>
          </div>
          <a
            href="mailto:contato@institutoincentive.org.br?subject=Certifica%C3%A7%C3%B5es%20e%20Reconhecimentos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange-light)] px-5 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:bg-white"
          >
            Enviar comprovação
            <ArrowUpRight size={18} />
          </a>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
