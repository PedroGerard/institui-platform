import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Política de Privacidade",
  description:
    "Diretrizes de privacidade, segurança e tratamento de dados pessoais no site e canais institucionais do Instituto Incentive.",
  path: "/privacidade",
});

const privacyTopics = [
  {
    title: "Finalidade legítima",
    text: "Os dados recebidos por formulários, e-mails ou mensagens destinam-se exclusivamente ao atendimento, prestação de informações institucionais, parcerias e projetos.",
  },
  {
    title: "Minimização e segurança",
    text: "Coletamos apenas as informações estritamente necessárias para cada finalidade, adotando práticas adequadas para proteger os dados contra acessos não autorizados.",
  },
  {
    title: "Não comercialização",
    text: "O Instituto Incentive não comercializa, não aluga e não compartilha dados pessoais com terceiros para fins publicitários ou econômicos.",
  },
  {
    title: "Transparência ativa",
    text: "Documentos públicos, relatórios e prestações de contas são publicados preservando a privacidade e os dados pessoais sensíveis de colaboradores e beneficiários.",
  },
];

const rights = [
  "Confirmar a existência de tratamento de dados pessoais sob responsabilidade do Instituto.",
  "Solicitar a correção de informações incompletas, inexatas ou desatualizadas.",
  "Requerer a eliminação de dados pessoais tratados com consentimento prévio, observadas as obrigações legais e estatutárias.",
  "Obter esclarecimentos sobre o uso compartilhado de dados com parceiros em projetos específicos.",
];

const cookieUses = [
  "Medições essenciais agregadas para garantir o funcionamento técnico e a estabilidade da plataforma.",
  "Ferramentas de análise opcionais ativadas exclusivamente mediante consentimento do usuário.",
  "Monitoramento de desempenho e velocidade de carregamento para constante aprimoramento da acessibilidade.",
  "Avaliação do alcance de campanhas institucionais e projetos sociais.",
];

const measuredInteractions = [
  "Envio de formulários de contato institucional.",
  "Abertura e download de documentos públicos, atas e relatórios de transparência.",
  "Cliques em canais oficiais de comunicação (e-mail, telefone e redes sociais).",
  "Acesso a páginas de projetos e fontes de comprovação pública.",
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">
              Privacidade e proteção de dados
            </p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Política de Privacidade do Instituto Incentive.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-muted)]">
              Esta página apresenta, de forma transparente e objetiva, as diretrizes do Instituto Incentive quanto à proteção e tratamento responsável de informações nos canais institucionais.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
            <ShieldCheck className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-xl font-bold">Compromisso institucional</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              A proteção de dados integra os princípios de integridade, ética, transparência e respeito aos direitos fundamentais que orientam toda a governança do Instituto Incentive.
            </p>
            <p className="mt-4 inline-flex rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
              Atualizada em outubro de 2026
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-4">
          {privacyTopics.map((topic) => (
            <article key={topic.title} className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
              <LockKeyhole className="text-[var(--brand-orange-light)]" size={26} />
              <h2 className="mt-4 text-lg font-bold">{topic.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">{topic.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Direitos do titular</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Como solicitar informações ou correções.
          </h2>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            Qualquer cidadão, parceiro ou participante de projetos pode esclarecer dúvidas sobre o tratamento de dados pelos canais oficiais de atendimento.
          </p>
        </div>

        <div className="grid gap-3">
          {rights.map((right) => (
            <div key={right} className="flex gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
              <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{right}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Cookies e medições</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Como usamos dados de navegação.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              O site utiliza recursos essenciais de funcionamento e métricas agregadas sem cookies para verificar estabilidade. Ferramentas opcionais de análise de audiência só são carregadas após autorização explícita.
            </p>
          </div>

          <div className="grid gap-3">
            {cookieUses.map((item) => (
              <div
                key={item}
                className="flex gap-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4"
              >
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-surface)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Eventos de conversão</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Métricas de utilidade pública.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              As medições têm o objetivo exclusivo de aprimorar a comunicação institucional, mensurar o alcance de ações e comprovar a efetividade da divulgação das iniciativas no território.
            </p>
          </div>

          <div className="grid gap-3">
            {measuredInteractions.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-4">
                <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-6">
            <FileText className="text-[var(--brand-teal)]" size={28} />
            <h2 className="mt-4 text-xl font-bold">Documentos públicos</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Atos constitutivos, certidões e relatórios oficiais são divulgados de forma organizada no Portal da Transparência institucional.
            </p>
            <Link
              href="/transparencia"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
            >
              Ver Portal da Transparência
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-6">
            <Mail className="text-[var(--brand-teal)]" size={28} />
            <h2 className="mt-4 text-xl font-bold">Canal do titular</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Para dúvidas, esclarecimentos sobre dados ou exercício de direitos, entre em contato pelo e-mail institucional.
            </p>
            <a
              href="mailto:contato@institutoincentive.org.br?subject=Privacidade%20e%20prote%C3%A7%C3%A3o%20de%20dados"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              contato@institutoincentive.org.br
              <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
