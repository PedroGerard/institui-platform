import Image from "next/image";
import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  BookOpen,
  HandHeart,
  Lightbulb,
  Network,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Users,
    title: "Inclusão",
    text: "Garantimos acesso a oportunidades para todos, respeitando e valorizando a diversidade.",
  },
  {
    icon: Network,
    title: "Sustentabilidade",
    text: "Desenvolvemos iniciativas que promovem o equilíbrio entre crescimento econômico, responsabilidade social e respeito ao meio ambiente.",
  },
  {
    icon: Lightbulb,
    title: "Inovação",
    text: "Buscamos soluções criativas e tecnológicas para enfrentar desafios sociais e econômicos.",
  },
  {
    icon: HandHeart,
    title: "Empoderamento",
    text: "Incentivamos a autonomia e o protagonismo das comunidades e indivíduos com quem trabalhamos.",
  },
  {
    icon: ShieldCheck,
    title: "Respeito aos Direitos Humanos",
    text: "Atuamos na defesa da dignidade, igualdade e justiça para todos os cidadãos.",
  },
  {
    icon: BookOpen,
    title: "Transparência",
    text: "Mantemos a integridade e a clareza em todas as nossas ações e parcerias.",
  },
];

const timeline = [
  {
    icon: Target,
    period: "2001",
    title: "O nascimento de um propósito",
    items: [
      "Fundação no município de Pereiro, no semiárido cearense.",
      "Um grupo de lideranças sociais se reúne para enfrentar desafios estruturais de desigualdade e falta de oportunidades.",
      "Nasce um agente de mobilização comunitária focado em cidadania e desenvolvimento sustentável.",
    ],
  },
  {
    icon: Users,
    period: "2002 - 2010",
    title: "Alicerces e fortalecimento",
    items: [
      "Foco inicial em ações educativas e culturais para jovens de comunidades rurais e periféricas.",
      "Formação de lideranças locais e fortalecimento do tecido comunitário no interior do Ceará.",
    ],
  },
  {
    icon: Lightbulb,
    period: "2011 - 2020",
    title: "Expansão estratégica e inovação",
    items: [
      "A instituição amadurece e passa a estruturar projetos complexos.",
      "Novas vertentes de atuação em inovação social, qualificação profissional, economia solidária e sustentabilidade ambiental.",
      "Consolidação de parcerias com setor público, empresas e academia, ampliando o alcance territorial.",
    ],
  },
  {
    icon: ShieldCheck,
    period: "2021 - 2025",
    title: "Modernização e escala",
    items: [
      "Implementação de novos instrumentos de gestão e monitoramento com foco em resultados e transparência.",
      "Atuação em programas de larga escala voltados ao desenvolvimento humano e territorial.",
      "Consolidação como organização de referência na execução de políticas de impacto socioambiental.",
    ],
  },
  {
    icon: HandHeart,
    period: "Hoje",
    title: "O futuro em movimento",
    items: [
      "Uma organização robusta, pronta para novos ciclos de desenvolvimento sustentável.",
      "Mais de duas décadas transformando vulnerabilidade em autonomia, dignidade e inclusão social.",
    ],
  },
];

export default function AboutPage() {
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
              href="/transparencia"
              className="hidden rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:inline-flex"
            >
              Transparência
            </Link>
            <Link
              href="/projetos"
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Ver projetos
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Quem somos</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Uma trajetória dedicada à inovação, inclusão e transformação social.
            </h1>
            <div className="mt-6 space-y-5 text-lg leading-8 text-[var(--brand-muted)]">
              <p>
                O Instituto Incentive de Inovação, Desenvolvimento e Transformação Social nasceu em 2001, no município de
                Pereiro, Ceará, com o propósito de gerar impacto positivo na sociedade por meio de iniciativas inovadoras
                e inclusivas.
              </p>
              <p>
                Criado por um grupo de pessoas comprometidas com a transformação social, o Instituto Incentive atua como
                agente de mudança, desenvolvendo projetos e ações voltadas para inclusão social, educação, tecnologia,
                sustentabilidade, cultura e empreendedorismo.
              </p>
            </div>
          </div>

          <div className="relative min-h-80 overflow-hidden rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tint)]">
            <Image
              src="/images/instituto-incentive-hero.png"
              alt="Equipe reunida em ambiente colaborativo discutindo projetos sociais"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Nossa trajetória</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Compromisso com comunidades, cidadania e desenvolvimento sustentável.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              Nossa trajetória é marcada por um compromisso inabalável com o bem-estar das comunidades, a defesa dos
              direitos humanos e a promoção do desenvolvimento sustentável. Ao longo dos anos, expandimos nossa atuação
              para diversas regiões do Brasil, sempre buscando criar oportunidades, fortalecer a cidadania e reduzir
              desigualdades.
            </p>
            <p>
              Com uma abordagem multidisciplinar e colaborativa, o Instituto Incentive promove parcerias com instituições
              públicas e privadas, organizações da sociedade civil e empresas comprometidas com a responsabilidade social.
              Nossas ações são guiadas pela ética, transparência e inovação, sempre com o objetivo de construir um futuro
              mais justo, inclusivo e sustentável para todos.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <PublicBrand variant="wordmark" className="justify-center" />
            <p className="mt-8 text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Linha do tempo</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Trajetória de impacto desde 2001.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Uma leitura organizada da evolução institucional do Instituto Incentive, da mobilização comunitária inicial
              à consolidação de uma agenda ampla de inovação, desenvolvimento e transformação social.
            </p>
          </div>

          <div className="relative mx-auto mt-12 max-w-5xl">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-[var(--brand-border-strong)] md:left-1/2 md:-translate-x-1/2" />

            <div className="grid gap-6">
              {timeline.map((entry, index) => {
                const Icon = entry.icon;
                const isRight = index % 2 === 0;

                return (
                  <article
                    key={entry.period}
                    className="relative grid gap-4 pl-14 md:grid-cols-[1fr_1fr] md:pl-0"
                  >
                    <div
                      className={`rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-5 shadow-sm ${
                        isRight ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-2xl font-bold text-[var(--brand-teal)]">{entry.period}</span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-dark)]">
                          <Icon size={23} />
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-bold uppercase tracking-[0.04em] text-[var(--brand-text)]">
                        {entry.title}
                      </h3>
                      <div className="mt-4 grid gap-3">
                        {entry.items.map((item) => (
                          <div key={item} className="flex gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand-teal)]" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="absolute left-5 top-6 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-4 border-white bg-[var(--brand-orange)] text-sm font-bold text-white shadow-sm md:left-1/2">
                      {index + 1}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2">
          <div>
            <Target className="text-[var(--brand-orange-light)]" size={30} />
            <h2 className="mt-4 text-xl font-bold">Missão</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">
              Promover a inclusão social, a inovação e o desenvolvimento sustentável, fortalecendo indivíduos e
              comunidades por meio da educação, tecnologia, empreendedorismo e assistência social, com foco na equidade e
              na justiça social.
            </p>
          </div>
          <div>
            <Users className="text-[var(--brand-orange-light)]" size={30} />
            <h2 className="mt-4 text-xl font-bold">Visão</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--brand-light-text)]">
              Ser reconhecido como uma referência regional em transformação social, inovação e desenvolvimento
              sustentável, impactando positivamente a vida de milhares de pessoas e contribuindo para a construção de uma
              sociedade mais justa, inclusiva e resiliente.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Valores</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Princípios que orientam nossas ações, parcerias e decisões.
          </h2>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {values.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-lg border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                  <Icon size={22} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{item.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <BookOpen className="text-[var(--brand-teal)]" size={28} />
            <h2 className="mt-3 text-2xl font-bold">Conheça as iniciativas em andamento.</h2>
          </div>
          <Link
            href="/projetos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Ver portfólio
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
