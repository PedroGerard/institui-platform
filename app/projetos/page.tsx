import type { Metadata } from "next";
import Image from "next/image";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import {
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Music,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Projetos",
  description:
    "Conheça as iniciativas, oficinas e ações estruturadas do Instituto Incentive no Mapa Cultural do Ceará e no território de Pereiro/CE.",
  path: "/projetos",
});

const projects = [
  {
    id: "7510",
    title: "Sons do Sertão",
    subtitle: "Formação Musical Comunitária e Democratização do Acesso à Cultura",
    axis: "Cultura e Formação",
    icon: Music,
    image: "/images/projects/7510.png",
    period: "01/06/2026 a 31/10/2026",
    place: "Bairro Vila Nova, Pereiro/CE",
    audience: "Crianças e adolescentes",
    value: "R$ 5.000,00",
    status: "Em execução",
    problem: "Baixo acesso a oportunidades gratuitas de formação musical e escassez de instrumentos para jovens em territórios periurbanos.",
    methodology: "12 oficinas práticas de iniciação ao violão, ensaios coletivos, formação de repertório e recital aberto à comunidade local.",
    deliveries: [
      "12 oficinas gratuitas de violão",
      "Recital público gratuito de encerramento",
      "Criação de acervo comunitário permanente com 10 violões",
      "Registro fotográfico e sistematização pedagógica",
    ],
    results: "Dados de resultado e registros audiovisuais em consolidação durante a execução.",
    source: "https://mapacultural.secult.ce.gov.br/projeto/7510/",
  },
  {
    id: "7429",
    title: "Beleza Criativa",
    subtitle: "Oficina de Formação em Técnicas de Manicure e Pedicure",
    axis: "Economia Criativa e Renda",
    icon: Sparkles,
    image: "/images/projects/7429.jpg",
    period: "08/12/2025 a 20/12/2025",
    place: "Pereiro/CE",
    audience: "Mulheres, jovens e população da zona rural",
    value: "Valor não informado na fonte",
    status: "Concluído / Em consolidação",
    problem: "Necessidade de capacitação técnica rápida e acessível para inclusão socioprodutiva e autonomia financeira feminina.",
    methodology: "Formação teórico-prática intensiva abrangendo técnicas de embelezamento, protocolos de biossegurança, atendimento e gestão de pequenos serviços.",
    deliveries: [
      "Capacitação prática em manicure e pedicure",
      "Orientação em biossegurança e esterilização",
      "Noções de precificação e atendimento ao cliente",
      "Estímulo ao microempreendedorismo feminino local",
    ],
    results: "Participantes capacitadas aptas para geração de renda imediata e autônoma.",
    source: "https://mapacultural.secult.ce.gov.br/projeto/7429/",
  },
  {
    id: "7512",
    title: "Conexão Profissional",
    subtitle: "Oficina de Formação em Instalação Elétrica Predial",
    axis: "Qualificação Profissional",
    icon: Zap,
    image: "/images/projects/7512.jpg",
    period: "25/05/2026 a 29/05/2026",
    place: "Pereiro/CE",
    audience: "Jovens, trabalhadores e população da zona rural",
    value: "Valor não informado na fonte",
    status: "Em consolidação",
    problem: "Demanda por profissionais qualificados em serviços prediais básicos e carência de cursos técnicos práticos na região.",
    methodology: "Aulas de fundamentos elétricos, normas técnicas (NR-10 básica), leitura de plantas, ferramentas operacionais e montagem de circuitos.",
    deliveries: [
      "Formação prática em circuitos elétricos prediais",
      "Treinamento de prevenção de acidentes e uso de EPIs",
      "Desenvolvimento de competências técnicas aplicadas",
      "Estímulo à inserção no mercado de trabalho e prestação de serviços",
    ],
    results: "Dados de acompanhamento de egressos em consolidação.",
    source: "https://mapacultural.secult.ce.gov.br/projeto/7512/",
  },
  {
    id: "6738",
    title: "I Fórum de Lideranças Associativas",
    subtitle: "Governança, Legalidade e Estratégias de Captação de Recursos",
    axis: "Fortalecimento Institucional",
    icon: Users,
    image: "/images/projects/6738.jpg",
    period: "24/05/2025",
    place: "Pereiro/CE",
    audience: "Lideranças comunitárias, associações, jovens, mulheres e agricultores",
    value: "Valor não informado na fonte",
    status: "Concluído",
    problem: "Dificuldades enfrentadas por associações comunitárias em gestão estatutária, prestação de contas, compliance e captação de recursos.",
    methodology: "Painéis temáticos, mesas-redondas, estudos de caso práticos e oficinas de alinhamento com a Lei 13.019/2014 (MROSC).",
    deliveries: [
      "Formação gratuita para lideranças comunitárias do município",
      "Debates sobre governança, transparência e responsabilidade civil",
      "Orientação técnica sobre editais e mecanismos de financiamento",
      "Articulação da rede de associações de Pereiro e região",
    ],
    results: "Fortalecimento da regularidade jurídica e administrativa das entidades locais participantes.",
    source: "https://mapacultural.secult.ce.gov.br/projeto/6738/",
  },
  {
    id: "6605",
    title: "Workshop de Fortalecimento do Terceiro Setor",
    subtitle: "Estratégias Contemporâneas para Captação de Recursos e Sustentabilidade",
    axis: "Terceiro Setor e Sustentabilidade",
    icon: Briefcase,
    image: "/images/projects/6605.jpg",
    period: "10/04/2025",
    place: "Pereiro/CE",
    audience: "Gestores sociais, lideranças de OSCs, coletivos e estudantes",
    value: "Valor não informado na fonte",
    status: "Concluído",
    problem: "Desafios de sustentabilidade financeira de longo prazo e formulação de projetos competitivos para editais públicos e privados.",
    methodology: "Capacitação imersiva focada em elaboração de propostas, planejamento financeiro de projetos, matriz de riscos e métricas de impacto social.",
    deliveries: [
      "Palestras e mentoria técnica em elaboração de propostas",
      "Capacitação em diversificação de fontes de financiamento",
      "Guia de boas práticas em sustentabilidade institucional",
      "Incentivo à cooperação e intercâmbio entre organizações sociais",
    ],
    results: "Qualificação técnica comprovada de gestores sociais e organizadores comunitários.",
    source: "https://mapacultural.secult.ce.gov.br/projeto/6605/",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Portfólio de Ações
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Projetos e Ações Comunitárias no Território.
            </h1>
          </div>
          <p className="text-base leading-8 text-[var(--brand-muted)]">
            As iniciativas do Instituto Incentive combinam <strong>formação cultural, inclusão socioprodutiva, capacitação profissional e fortalecimento institucional</strong>, estruturadas com transparência e registradas publicamente no Mapa Cultural do Ceará.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        <div className="grid gap-5 md:grid-cols-4">
          <div className="rounded-xl border border-[var(--brand-border)] bg-white p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-[var(--brand-teal)]">5</p>
            <p className="mt-2 text-sm font-bold text-[var(--brand-text)]">Projetos Registrados</p>
          </div>
          <div className="rounded-xl border border-[var(--brand-border)] bg-white p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-[var(--brand-teal)]">4</p>
            <p className="mt-2 text-sm font-bold text-[var(--brand-text)]">Eixos de Impacto</p>
          </div>
          <div className="rounded-xl border border-[var(--brand-border)] bg-white p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-[var(--brand-teal)]">Pereiro/CE</p>
            <p className="mt-2 text-sm font-bold text-[var(--brand-text)]">Território Prioritário</p>
          </div>
          <div className="rounded-xl border border-[var(--brand-border)] bg-white p-5 shadow-sm">
            <p className="text-3xl font-extrabold text-[var(--brand-teal)]">100%</p>
            <p className="mt-2 text-sm font-bold text-[var(--brand-text)]">Acesso Gratuito</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 sm:px-8">
        {projects.map((project) => {
          const Icon = project.icon;
          const isLogoImage = project.image === "/images/projects/7510.png";

          return (
            <article
              key={project.id}
              className="overflow-hidden rounded-xl border border-[var(--brand-border)] bg-white shadow-sm transition duration-200 hover:border-[var(--brand-teal)] hover:shadow-md"
            >
              <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
                <div className={isLogoImage ? "relative min-h-80 bg-white flex items-center justify-center p-6" : "relative min-h-80 bg-[var(--brand-tint)]"}>
                  <Image
                    src={project.image}
                    alt={`Imagem do projeto ${project.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className={isLogoImage ? "object-contain p-4" : "object-cover"}
                  />
                  <div className="absolute top-4 left-4 z-10">
                    <span className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-teal)] shadow-sm backdrop-blur">
                      Mapa Cultural #{project.id}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--brand-teal)]">
                      <Icon size={16} />
                      {project.axis}
                    </span>
                    <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-1.5 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                      {project.status}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-text)] sm:text-3xl">
                    {project.title}
                  </h2>
                  <p className="mt-1.5 text-sm font-semibold text-[var(--brand-muted)]">{project.subtitle}</p>

                  <div className="mt-5 rounded-lg bg-[var(--brand-surface)] p-4 text-sm leading-6 text-[var(--brand-muted)]">
                    <strong className="text-[var(--brand-text)]">Problema Social Abordado: </strong>
                    {project.problem}
                  </div>

                  <div className="mt-5 grid gap-3 text-sm text-[var(--brand-muted)] sm:grid-cols-2">
                    <div className="flex items-start gap-2.5">
                      <CalendarDays className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                      <span>{project.period}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <MapPin className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                      <span>{project.place}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Users className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                      <span>{project.audience}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CircleDollarSign className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                      <span>{project.value}</span>
                    </div>
                  </div>

                  <div className="mt-5">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--brand-orange-dark)]">Entregas e Resultados Previstos</p>
                    <div className="mt-2.5 grid gap-2">
                      {project.deliveries.map((delivery) => (
                        <div key={delivery} className="flex items-center gap-2.5 text-sm font-medium text-[var(--brand-text)]">
                          <CheckCircle2 className="shrink-0 text-[var(--brand-teal)]" size={16} />
                          <span>{delivery}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[var(--brand-border-soft)] pt-5">
                    <TrackedAnchor
                      href={project.source}
                      target="_blank"
                      rel="noreferrer"
                      eventName="project_source_click"
                      eventProperties={{ project: project.id, source: "mapa_cultural" }}
                      className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
                    >
                      Consultar no Mapa Cultural do Ceará
                      <ArrowUpRight size={16} />
                    </TrackedAnchor>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>

      <PublicFooter />
    </main>
  );
}
