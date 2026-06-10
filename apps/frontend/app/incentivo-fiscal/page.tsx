import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileSearch,
  HandCoins,
  Landmark,
  Lightbulb,
  Scale,
} from "lucide-react";

const paths = [
  "Entender quais leis e mecanismos se aplicam ao projeto ou organização.",
  "Organizar documentação, objetivos, público e impacto esperado.",
  "Buscar editais, fundos, empresas apoiadoras e oportunidades de destinação.",
  "Prestar contas com clareza para fortalecer confiança e continuidade.",
];

const audiences = [
  {
    icon: Building2,
    title: "Empresas",
    text: "Podem integrar responsabilidade social, estratégia fiscal e apoio a projetos com impacto público.",
  },
  {
    icon: FileSearch,
    title: "Organizações sociais",
    text: "Podem estruturar projetos, acessar oportunidades e ampliar sua capacidade de execução.",
  },
  {
    icon: HandCoins,
    title: "Pessoas físicas",
    text: "Podem compreender caminhos de destinação e participação em iniciativas sociais e culturais.",
  },
];

export default function FiscalIncentivePage() {
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
              Fale conosco
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Incentivo fiscal</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Informação para transformar obrigações fiscais em impacto social.
            </h1>
          </div>
          <p className="text-lg leading-8 text-[var(--brand-muted)]">
            Leis de incentivo fiscal permitem que recursos previstos na legislação sejam direcionados a iniciativas
            culturais, sociais, esportivas, educacionais e comunitárias. O papel do Instituto Incentive é ajudar a tornar
            esse caminho mais claro, responsável e acessível.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-14 sm:px-8 md:grid-cols-3">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <article key={audience.title} className="rounded-lg border border-white/[0.12] bg-white/[0.07] p-6">
                <Icon className="text-[var(--brand-orange-light)]" size={30} />
                <h2 className="mt-4 text-xl font-bold">{audience.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">{audience.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <Scale className="text-[var(--brand-teal)]" size={34} />
          <h2 className="mt-4 text-3xl font-bold">Como esse caminho funciona</h2>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            O incentivo fiscal exige informação, planejamento e prestação de contas. Quando bem utilizado, ajuda a
            aproximar recursos disponíveis de projetos capazes de gerar benefício coletivo.
          </p>
        </div>

        <ol className="grid gap-3">
          {paths.map((path, index) => (
            <li key={path} className="flex gap-4 rounded-lg border border-[var(--brand-border)] bg-white p-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-teal)] text-sm font-bold text-white">
                {index + 1}
              </span>
              <span className="pt-1 text-sm font-semibold leading-6 text-[var(--brand-text)]">{path}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2">
          <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
            <Landmark className="text-[var(--brand-teal)]" size={30} />
            <h2 className="mt-4 text-2xl font-bold">Para apoiar projetos</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Empresas e pessoas podem conhecer oportunidades de destinação e apoio, fortalecendo projetos com impacto
              territorial e comunitário.
            </p>
          </div>
          <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
            <Lightbulb className="text-[var(--brand-teal)]" size={30} />
            <h2 className="mt-4 text-2xl font-bold">Para estruturar iniciativas</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">
              Organizações podem transformar ideias em projetos mais claros, com metas, públicos, contrapartidas e
              caminhos de sustentabilidade.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-tint)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-1 shrink-0 text-[var(--brand-teal)]" size={24} />
            <div>
              <h2 className="text-2xl font-bold">Quer conversar sobre incentivo fiscal?</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
                O Instituto Incentive pode ajudar a organizar informações e caminhos para projetos e parcerias.
              </p>
            </div>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Entrar em contato
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
