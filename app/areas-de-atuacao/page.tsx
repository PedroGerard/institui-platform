import type { Metadata } from "next";
import Link from "next/link";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Heart,
  Home,
  Landmark,
  Leaf,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Áreas de Atuação",
  description:
    "Conheça os 8 eixos programáticos do Instituto Incentive em desenvolvimento territorial, proteção social, educação, cultura, sustentabilidade e inovação.",
  path: "/areas-de-atuacao",
});

const programmaticAxes = [
  {
    icon: Heart,
    axisNumber: "Eixo 01",
    title: "Proteção Social, Assistência e Garantia de Direitos",
    description: "Defesa dos direitos humanos, fortalecimento de vínculos familiares e acolhimento socioassistencial.",
    items: [
      "Ações socioassistenciais gratuitas voltadas a indivíduos e famílias em vulnerabilidade social.",
      "Promoção e defesa dos direitos de crianças, adolescentes, mulheres, idosos e pessoas com deficiência.",
      "Articulação intersetorial com a rede socioassistencial e conselhos de direitos.",
    ],
  },
  {
    icon: Briefcase,
    axisNumber: "Eixo 02",
    title: "Inclusão Socioprodutiva e Economia Popular e Solidária",
    description: "Capacitação profissional, fomento ao empreendedorismo comunitário e geração de renda.",
    items: [
      "Oficinas de capacitação técnica, inclusão produtiva e desenvolvimento de competências práticas.",
      "Estímulo a empreendimentos econômicos solidários e arranjos produtivos locais.",
      "Orientação para autonomia financeira de mulheres, jovens e trabalhadores informais.",
    ],
  },
  {
    icon: Sprout,
    axisNumber: "Eixo 03",
    title: "Desenvolvimento Rural Sustentável e Segurança Alimentar",
    description: "Fortalecimento da agricultura familiar, convivência com o semiárido e soberania alimentar.",
    items: [
      "Incentivo a práticas agrícolas sustentáveis e adaptação climática no semiárido cearense.",
      "Apoio a redes comunitárias de produção, beneficiamento e comercialização de alimentos.",
      "Iniciativas de segurança alimentar e nutricional para comunidades rurais periurbanas.",
    ],
  },
  {
    icon: GraduationCap,
    axisNumber: "Eixo 04",
    title: "Educação, Formação Profissional, Cultura e Esporte",
    description: "Democratização do acesso à cultura, formação continuada e desenvolvimento humano integral.",
    items: [
      "Oficinas culturais gratuitas, musicalização comunitária e valorização das tradições locais.",
      "Cursos livres de qualificação e iniciação profissional para inserção no mercado de trabalho.",
      "Incentivo ao esporte, lazer e expressões artísticas como ferramentas de inclusão cidadã.",
    ],
  },
  {
    icon: Leaf,
    axisNumber: "Eixo 05",
    title: "Meio Ambiente, Sustentabilidade e Tecnologias Socioambientais",
    description: "Preservação da caatinga, gestão hídrica consciente e tecnologias ecológicas apropriadas.",
    items: [
      "Educação ambiental voltada à conservação do bioma caatinga e biodiversidade regional.",
      "Disseminação de tecnologias sociais de convivência com o semiárido e reaproveitamento de recursos.",
      "Projetos de arborização, recuperação ambiental e gestão responsável de resíduos.",
    ],
  },
  {
    icon: Home,
    axisNumber: "Eixo 06",
    title: "Habitação de Interesse Social e Desenvolvimento Territorial",
    description: "Melhoria das condições de habitabilidade, planejamento comunitário e infraestrutura social.",
    items: [
      "Diagnósticos territoriais e apoio a iniciativas de melhoria habitacional comunitária.",
      "Planejamento participativo voltado ao desenvolvimento urbano e rural integrado.",
      "Valorização dos espaços públicos e infraestruturas comunitárias de convivência.",
    ],
  },
  {
    icon: Cpu,
    axisNumber: "Eixo 07",
    title: "Inovação, Tecnologia Social e Desenvolvimento Científico",
    description: "Inclusão digital, soluções tecnológicas abertas e metodologias sociais contemporâneas.",
    items: [
      "Inclusão digital e letramento tecnológico para jovens e comunidades do semiárido.",
      "Aplicação de metodologias sociais inovadoras para resolução de desafios públicos locais.",
      "Intercâmbio com universidades, institutos federais e centros de pesquisa aplicada.",
    ],
  },
  {
    icon: Landmark,
    axisNumber: "Eixo 08",
    title: "Fortalecimento Institucional e Governança Social",
    description: "Qualificação de lideranças comunitárias, transparência, captação e sustentabilidade do Terceiro Setor.",
    items: [
      "Capacitação para gestores e associações em governança, compliance e MROSC (Lei 13.019/14).",
      "Formação em elaboração de projetos, editais públicos e estratégias de sustentabilidade.",
      "Fóruns de diálogo e articulação de redes comunitárias para fortalecimento da cidadania.",
    ],
  },
];

export default function PracticeAreasPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Estrutura Programática
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              8 Eixos Estratégicos de Atuação Territorial.
            </h1>
          </div>
          <div className="space-y-4 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Instituto Incentive organiza suas intervenções com base nos <strong>eixos programáticos estatutários</strong>, articulando assistência social, educação, trabalho, cultura, sustentabilidade, tecnologia e fortalecimento do Terceiro Setor.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              Cada eixo orienta projetos, termos de colaboração, parcerias técnicas e investimentos sociais com foco em resultados mensuráveis no semiárido.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 md:grid-cols-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <Users className="text-[var(--brand-orange-light)]" size={32} />
            <h2 className="mt-4 text-2xl font-extrabold">8 Eixos Integrados</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Uma matriz programática abrangente que conecta as demandas reais das comunidades às oportunidades de desenvolvimento.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <ShieldCheck className="text-[var(--brand-orange-light)]" size={32} />
            <h2 className="mt-4 text-2xl font-extrabold">Direitos e Inclusão</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Prioridade absoluta para populações em situação de vulnerabilidade, juventude, mulheres e trabalhadores rurais.
            </p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.06] p-6">
            <Building2 className="text-[var(--brand-orange-light)]" size={32} />
            <h2 className="mt-4 text-2xl font-extrabold">Articulação em Redes</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Cooperação técnica permanente com poder público, empresas socialmente responsáveis e organizações comunitárias.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-6 md:grid-cols-2">
          {programmaticAxes.map((axis) => {
            const Icon = axis.icon;

            return (
              <article
                key={axis.axisNumber}
                className="flex flex-col justify-between rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm transition duration-200 hover:border-[var(--brand-teal)] hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                      <Icon size={24} />
                    </div>
                    <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                      {axis.axisNumber}
                    </span>
                  </div>

                  <h2 className="mt-5 text-xl font-extrabold text-[var(--brand-text)]">{axis.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{axis.description}</p>

                  <div className="mt-5 space-y-3">
                    {axis.items.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 border-t border-[var(--brand-border-soft)] pt-4">
                  <Link
                    href="/projetos"
                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
                  >
                    Ver projetos relacionados
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-[var(--brand-text)]">Deseja estruturar uma parceria programática?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Entre em contato para apresentar propostas de convênios, cooperação técnica ou financiamento de iniciativas.
            </p>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Falar com a Equipe
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
