import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Politica de Privacidade",
  description:
    "Politica de privacidade do Instituto Incentive, com orientacoes sobre contato, finalidade institucional, transparencia e direitos dos titulares.",
  path: "/privacidade",
});

const privacyTopics = [
  {
    title: "Dados de contato",
    text: "Quando uma pessoa envia mensagem ao Instituto, podemos tratar nome, e-mail, telefone, assunto e conteúdo informado voluntariamente.",
  },
  {
    title: "Finalidade institucional",
    text: "As informações são utilizadas para responder solicitações, organizar relacionamentos institucionais, registrar demandas e apoiar a comunicação com parceiros e comunidade.",
  },
  {
    title: "Transparência e prestação de contas",
    text: "Documentos públicos podem ser divulgados no site quando necessários para governança, cumprimento legal, controle social e publicidade institucional.",
  },
  {
    title: "Segurança e acesso",
    text: "O Instituto restringe o acesso às informações pessoais a pessoas autorizadas e mantém práticas de cuidado documental compatíveis com sua atuação.",
  },
];

const rights = [
  "Solicitar informação sobre o tratamento de seus dados pessoais.",
  "Pedir correção de dados incompletos, inexatos ou desatualizados.",
  "Solicitar exclusão ou revisão de informações quando aplicável.",
  "Entrar em contato para dúvidas sobre privacidade e proteção de dados.",
];

const cookieUses = [
  "Medir acessos, páginas mais visitadas e desempenho técnico do site.",
  "Entender quais canais levam pessoas aos formulários, documentos e páginas de projetos.",
  "Apoiar campanhas de interesse público, como Google Ad Grants, sem coletar dados sensíveis.",
  "Melhorar conteúdo, navegação, acessibilidade e prestação de contas.",
];

const measuredInteractions = [
  "Envio do formulário de contato por e-mail.",
  "Cliques em e-mail, telefone, redes sociais e chamadas de apoio.",
  "Abertura ou download de documentos públicos em PDF.",
  "Acesso a projetos em plataformas públicas de referência.",
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
              Esta página apresenta, de forma objetiva, como o Instituto Incentive orienta o tratamento de informações
              pessoais recebidas pelos canais institucionais e pelo site.
            </p>
          </div>

          <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
            <ShieldCheck className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-xl font-bold">Compromisso institucional</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              A proteção de dados acompanha os princípios de ética, transparência, respeito aos direitos humanos e
              responsabilidade social que orientam a atuação do Instituto.
            </p>
            <p className="mt-4 inline-flex rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
              Atualizada em 24 de junho de 2026
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
            Pessoas que mantêm contato com o Instituto podem solicitar esclarecimentos sobre dados pessoais pelos canais
            oficiais de atendimento.
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
              O site utiliza recursos essenciais de funcionamento e medições agregadas para compreender o desempenho das
              páginas. Ferramentas opcionais do Google Analytics ou Google Tag Manager só são carregadas após aceite do
              visitante no aviso de privacidade.
            </p>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              O objetivo principal é melhorar a comunicação institucional, acompanhar campanhas de interesse público,
              qualificar a experiência de navegação e ampliar o alcance das ações do Instituto.
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
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Quais interações podem ser medidas.</h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              As medições opcionais ajudam o Instituto a avaliar se o site está cumprindo sua função pública: informar,
              facilitar contato, apoiar campanhas de interesse social e melhorar a navegação.
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
              Informações de transparência, certificações e documentos institucionais são publicadas para consulta
              pública quando sua divulgação é necessária ou adequada à finalidade institucional.
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
            <h2 className="mt-4 text-xl font-bold">Canal de contato</h2>
            <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">
              Para dúvidas sobre privacidade, atualização de dados ou solicitações relacionadas aos canais
              institucionais, utilize o e-mail oficial do Instituto.
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
