import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildMailto, siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  Keyboard,
  Mail,
  MousePointerClick,
  ShieldCheck,
  Type,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Acessibilidade",
  description:
    "Recursos e práticas de acessibilidade digital do site do Instituto Incentive, com foco em navegação, contraste, leitura e usabilidade inclusiva.",
  path: "/acessibilidade",
});

const accessibilityPractices = [
  {
    icon: Keyboard,
    title: "Navegação por teclado",
    text: "O site possui atalho direto para o conteúdo principal, ordem lógica de tabulação e foco visível em todos os elementos interativos.",
  },
  {
    icon: Eye,
    title: "Contraste e legibilidade",
    text: "A paleta de cores institucional segue parâmetros de contraste para facilitar a leitura em telas diversas e sob luz solar.",
  },
  {
    icon: Type,
    title: "Textos objetivos",
    text: "Páginas estruturadas com hierarquia semântica de títulos (H1 a H3) e redação clara e direta.",
  },
  {
    icon: MousePointerClick,
    title: "Ações identificáveis",
    text: "Botões e links com rótulos descritivos que esclarecem o destino ou a ação executada.",
  },
];

const continuousImprovements = [
  "Revisão contínua de textos alternativos (alt text) em todas as imagens e gráficos publicados.",
  "Disponibilização de documentos em PDF pesquisáveis e com estrutura de cabeçalhos.",
  "Testes periódicos em dispositivos móveis, leitores de tela e navegadores variados.",
  "Abertura a sugestões e apontamentos da comunidade através dos canais de contato.",
];

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Acessibilidade</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Uma experiência digital clara, navegável e acessível para todos.
            </h1>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Instituto Incentive prioriza uma navegação inclusiva e transparente, assegurando que pessoas com diferentes necessidades possam acessar informações institucionais, projetos, documentos e canais de contato com autonomia.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              A conformidade com diretrizes de acessibilidade na web (WCAG) é tratada como compromisso contínuo e evolutivo.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-4">
          {accessibilityPractices.map((practice) => {
            const Icon = practice.icon;

            return (
              <article key={practice.title} className="rounded-lg border border-white/10 bg-white/[0.07] p-5">
                <Icon className="text-[var(--brand-orange-light)]" size={30} />
                <h2 className="mt-4 text-lg font-bold">{practice.title}</h2>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">{practice.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <ShieldCheck className="text-[var(--brand-teal)]" size={34} />
          <h2 className="mt-4 text-3xl font-bold">Compromisso com melhorias permanentes.</h2>
          <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
            Caso identifique qualquer barreira de acessibilidade ou inconsistência na navegação, envie sua mensagem para que possamos efetuar a correção necessária.
          </p>
          <a
            href={buildMailto("Acessibilidade no site do Instituto Incentive")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Relatar dificuldade
            <Mail size={17} />
          </a>
        </div>

        <div className="grid gap-3">
          {continuousImprovements.map((item) => (
            <div key={item} className="flex gap-3 rounded-lg border border-[var(--brand-border)] bg-white p-4">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
              <p className="text-sm font-semibold leading-6 text-[var(--brand-text)]">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Canal oficial de contato</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Dúvidas ou sugestões de acessibilidade podem ser enviadas diretamente para {siteConfig.email}.
            </p>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
          >
            Ir para contato
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
