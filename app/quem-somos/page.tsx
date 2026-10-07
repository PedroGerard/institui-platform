import type { Metadata } from "next";
import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { siteConfig } from "@/lib/site-config";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Compass,
  Handshake,
  HeartHandshake,
  Landmark,
  Lightbulb,
  MapPin,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Quem Somos",
  description:
    "Conheça a história, identidade, governança e propósito institucional do Instituto Incentive de Inovação, Desenvolvimento e Transformação Social.",
  path: "/quem-somos",
});

const timeline = [
  {
    period: "2001",
    title: "Fundação e Raízes Comunitárias",
    icon: Sparkles,
    items: [
      "Fundação oficial em 23 de janeiro de 2001 no município de Pereiro/CE.",
      "Mobilização comunitária para acolhimento de famílias e apoio a iniciativas locais.",
      "Início da trajetória voltada à promoção da cidadania e desenvolvimento territorial no semiárido.",
    ],
  },
  {
    period: "2010",
    title: "Expansão de Frentes Socioeducativas",
    icon: Users,
    items: [
      "Estruturação de iniciativas de inclusão produtiva e capacitação para jovens e mulheres.",
      "Fortalecimento do diálogo comunitário e articulação com lideranças do Vale do Jaguaribe.",
      "Atuação voltada à redução das desigualdades regionais e valorização da cultura local.",
    ],
  },
  {
    period: "2018",
    title: "Consolidação em Redes e Projetos Culturais",
    icon: Award,
    items: [
      "Desenvolvimento de projetos culturais estruturados e fomento à economia criativa.",
      "Apoio a iniciativas de governança, associativismo e fortalecimento do Terceiro Setor.",
      "Ampliação da presença institucional em plataformas públicas de cultura e desenvolvimento social.",
    ],
  },
  {
    period: "2024",
    title: "Reconhecimentos e Certificações Setoriais",
    icon: Landmark,
    items: [
      "Certificações CADASTUR como Organizadora de Eventos e Prestador Especializado.",
      "Declaração de Empreendimento Econômico Solidário pelo DCSOL.",
      "Cadastro no Sistema Nacional de Pontos e Pontões de Cultura (MinC).",
    ],
  },
  {
    period: "2026",
    title: "Reforma Estatutária e Governança Contemporânea",
    icon: ShieldCheck,
    items: [
      "Modernização estatutária alinhada às melhores práticas de compliance, MROSC e ITG 2002.",
      "Portal da Transparência institucional e prestação de contas pública digital.",
      "Posicionamento consolidado como organização de desenvolvimento territorial e inovação social.",
    ],
  },
];

const statutoryPillars = [
  {
    title: "Identidade Institucional",
    badge: "Natureza Jurídica",
    icon: Landmark,
    text: "Associação civil de direito privado (Organização da Sociedade Civil - OSC), sem fins lucrativos, dotada de autonomia administrativa, financeira e patrimonial, com sede em Pereiro/CE.",
  },
  {
    title: "Objeto Social",
    badge: "Escopo de Atuação",
    icon: Compass,
    text: "Desenvolvimento territorial, inovação social, proteção e assistência social, qualificação profissional, fomento à cultura, tecnologias sociais, preservação ambiental e fortalecimento institucional.",
  },
  {
    title: "Finalidades",
    badge: "Interesse Público",
    icon: Target,
    text: "Gerar oportunidades sustentáveis, combater vulnerabilidades, universalizar o acesso a direitos e prestar serviços gratuitos de relevância pública e interesse social.",
  },
  {
    title: "Objetivos Institucionais",
    badge: "Execução Contínua",
    icon: Lightbulb,
    text: "Planejar, formular e executar projetos, oficinas, convênios e assessorias técnicas com excelência metodológica, rastreabilidade e mensuração de impacto.",
  },
];

const governanceStructure = [
  {
    organ: "Assembleia Geral",
    role: "Instância Máxima Deliberativa",
    desc: "Composta pelos associados em pleno gozo de seus direitos estatutários, responsável pela aprovação de contas, reformas estatutárias e diretrizes magnas.",
  },
  {
    organ: "Diretoria Executiva",
    role: "Órgão de Gestão e Administração",
    desc: "Composta por Diretor Presidente, Diretor Administrativo-Financeiro e Diretor Técnico, com mandato de 4 anos e regra de dupla assinatura para movimentação de recursos.",
  },
  {
    organ: "Conselho Fiscal",
    role: "Órgão Independente de Controle",
    desc: "Composto por 3 membros titulares e suplentes, responsável pelo exame de livros, registros contábeis, parecer sobre demonstrações financeiras e conformidade normativa.",
  },
];

const values = [
  {
    icon: Scale,
    title: "Ética e Integridade",
    text: "Gestão orientada pela legalidade estrita, impessoalidade, respeito aos recursos públicos e privados e governança transparente.",
  },
  {
    icon: MapPin,
    title: "Pertencimento Territorial",
    text: "Valorização da identidade, cultura, vocações econômicas e saberes das comunidades do semiárido cearense.",
  },
  {
    icon: Lightbulb,
    title: "Inovação Social",
    text: "Construção de soluções contemporâneas, replicáveis e efetivas para desafios sociais, educacionais e ambientais.",
  },
  {
    icon: HeartHandshake,
    title: "Equidade e Inclusão",
    text: "Atuação focada na garantia de direitos e dignidade para populações em situação de vulnerabilidade, mulheres, jovens e trabalhadores rurais.",
  },
  {
    icon: Handshake,
    title: "Cooperação e Redes",
    text: "Articulação contínua com governos, empresas, universidades e organizações da sociedade civil para ampliar o impacto social.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência Ativa",
    text: "Publicidade clara de atos, certidões, demonstrações financeiras e resultados de projetos como compromisso fundamental.",
  },
];

const servicePrinciples = [
  "Gratuidade integral dos serviços socioassistenciais prestados aos beneficiários.",
  "Universalidade de atendimento sem exigência de filiação associativa.",
  "Não discriminação de gênero, raça, etnia, credo, orientação ou condição social.",
  "Aplicação integral de superávits e recursos no território nacional e nos fins institucionais.",
  "Vedação absoluta à distribuição de lucros, dividendos, participações ou parcelas do patrimônio líquido.",
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--brand-teal)]">
              <Compass size={16} />
              Identidade Institucional
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Desenvolvimento territorial, inovação social e fortalecimento comunitário.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-muted)]">
              O <strong>Instituto Incentive de Inovação, Desenvolvimento e Transformação Social</strong> é uma Organização da Sociedade Civil (OSC) fundada em 2001 em Pereiro/CE, dedicada a estruturar soluções integradas de impacto social, econômico, cultural e ambiental no Ceará e no semiárido.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/areas-de-atuacao"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Conhecer Áreas de Atuação
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
              >
                Portal da Transparência
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-tint)] p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-[var(--brand-text)]">Dados Cadastrais Oficiais</h2>
            <div className="mt-5 space-y-4 text-sm font-semibold text-[var(--brand-text)]">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">Razão Social</span>
                <span className="mt-1 block text-base font-extrabold text-[var(--brand-teal)]">{siteConfig.fullName}</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">CNPJ</span>
                  <span className="mt-1 block font-extrabold">{siteConfig.cnpj}</span>
                </div>
                <div className="rounded-lg bg-white p-4 shadow-sm">
                  <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">Ano de Fundação</span>
                  <span className="mt-1 block font-extrabold">{siteConfig.foundedAt} (23/01/2001)</span>
                </div>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <span className="block text-xs font-bold uppercase text-[var(--brand-muted)]">Sede Institucional</span>
                <span className="mt-1 block text-sm leading-6">{siteConfig.address.line}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Matriz Estatutária</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Distinção semântica e clareza de propósito.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Em consonância com as normas estatutárias e a legislação do Terceiro Setor, o Instituto Incentive mantém rigorosa diferenciação entre seus conceitos fundamentais de governança:
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {statutoryPillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 transition hover:border-[var(--brand-teal)] hover:shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                      <Icon size={24} />
                    </div>
                    <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-1 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                      {pillar.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 text-xl font-extrabold text-[var(--brand-text)]">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--brand-muted)]">{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 md:grid-cols-2">
          <div>
            <Target className="text-[var(--brand-orange-light)]" size={34} />
            <h2 className="mt-4 text-2xl font-extrabold">Missão</h2>
            <p className="mt-3 text-base leading-7 text-[var(--brand-light-text)]">
              Promover a inclusão social, a inovação e o desenvolvimento sustentável, fortalecendo indivíduos, organizações e comunidades por meio da educação, qualificação profissional, cultura, tecnologia social e assistência humanizada, com foco em equidade, cidadania e justiça social.
            </p>
          </div>
          <div>
            <Users className="text-[var(--brand-orange-light)]" size={34} />
            <h2 className="mt-4 text-2xl font-extrabold">Visão</h2>
            <p className="mt-3 text-base leading-7 text-[var(--brand-light-text)]">
              Consolidar-se como uma instituição de referência em desenvolvimento territorial e inovação social no semiárido nordestino, reconhecida pela excelência em projetos, solidez de governança, integridade e capacidade de gerar impacto transformador e duradouro.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-[var(--brand-border)] bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <PublicBrand variant="wordmark" className="justify-center" />
            <p className="mt-6 text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">História e Evolução</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Trajetória de atuação comunitária desde 2001.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Uma linha do tempo estruturada que reflete o amadurecimento institucional do Instituto Incentive, desde as primeiras ações comunitárias até a consolidação de uma plataforma territorial contemporânea.
            </p>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl">
            <div className="absolute bottom-0 left-5 top-0 w-px bg-[var(--brand-border-strong)] md:left-1/2 md:-translate-x-1/2" />

            <div className="grid gap-8">
              {timeline.map((entry, index) => {
                const Icon = entry.icon;
                const isRight = index % 2 === 0;

                return (
                  <article
                    key={entry.period}
                    className="relative grid gap-4 pl-14 md:grid-cols-[1fr_1fr] md:pl-0"
                  >
                    <div
                      className={`rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-sm ${
                        isRight ? "md:col-start-2" : "md:col-start-1 md:row-start-1"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <span className="text-3xl font-extrabold text-[var(--brand-teal)]">{entry.period}</span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-orange-soft)] text-[var(--brand-orange-dark)]">
                          <Icon size={22} />
                        </span>
                      </div>

                      <h3 className="mt-4 text-lg font-extrabold uppercase tracking-wide text-[var(--brand-text)]">
                        {entry.title}
                      </h3>
                      <div className="mt-4 grid gap-2.5">
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

      <section className="bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Governança Institucional</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Estrutura deliberativa, executiva e fiscalizadora.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A governança do Instituto Incentive é estruturada para garantir segregação de funções, controle social interno e decisões colegiadas transparentes:
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {governanceStructure.map((gov) => (
              <article key={gov.organ} className="rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <span className="rounded-lg bg-[var(--brand-tint)] px-3 py-1 text-xs font-bold uppercase text-[var(--brand-teal)]">
                  {gov.role}
                </span>
                <h3 className="mt-4 text-xl font-extrabold text-[var(--brand-text)]">{gov.organ}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{gov.desc}</p>
              </article>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-tint)] p-6">
            <h3 className="text-lg font-extrabold text-[var(--brand-text)]">Princípios de Atendimento e Compliance Estatutário</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {servicePrinciples.map((principle) => (
                <div key={principle} className="flex items-start gap-3 rounded-lg bg-white p-3.5 shadow-sm">
                  <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                  <span className="text-xs font-bold leading-5 text-[var(--brand-text)]">{principle}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Valores</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Princípios que guiam nossas ações, parcerias e decisões.
            </h2>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {values.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-sm transition hover:border-[var(--brand-teal)]">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-[var(--brand-text)]">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <BookOpen className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-3 text-2xl font-extrabold text-[var(--brand-text)]">Conheça as iniciativas em andamento.</h2>
            <p className="mt-1 text-sm text-[var(--brand-muted)]">Acesse nosso portfólio de projetos e ações no território.</p>
          </div>
          <Link
            href="/projetos"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Ver Portfólio de Projetos
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
