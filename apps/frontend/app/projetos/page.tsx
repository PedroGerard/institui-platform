import Image from "next/image";
import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  MapPin,
  Music,
  Sparkles,
  Users,
  Wrench,
} from "lucide-react";

const projects = [
  {
    id: "7510",
    title: "Sons do Sertão",
    subtitle: "Formação Musical Comunitária e Democratização do Acesso à Cultura",
    axis: "Cultura e formação artística",
    image: "/images/projects/7510.png",
    icon: Music,
    period: "01/06/2026 a 31/10/2026",
    place: "Bairro Vila Nova, Pereiro/CE",
    audience: "Crianças e adolescentes",
    value: "R$ 5.000,00",
    summary:
      "Oficinas gratuitas de iniciação ao violão para ampliar o acesso à cultura, fortalecer vínculos comunitários e estimular o protagonismo cultural de jovens e moradores do território.",
    highlights: ["12 oficinas de violão", "Recital público gratuito", "Acervo comunitário com 10 violões"],
    source: "https://mapacultural.secult.ce.gov.br/projeto/7510/",
  },
  {
    id: "7429",
    title: "Beleza Criativa",
    subtitle: "Oficina de Formação em Técnicas de Manicure e Pedicure",
    axis: "Inclusão produtiva e economia criativa",
    image: "/images/projects/7429.jpg",
    icon: Sparkles,
    period: "08/12/2025 a 20/12/2025",
    place: "Pereiro/CE",
    audience: "Mulheres, jovens, adultos e população da zona rural",
    value: "Não informado",
    summary:
      "Formação prática voltada à qualificação profissional, autonomia financeira e geração de renda por meio do segmento da beleza e estética.",
    highlights: ["Capacitação em manicure e pedicure", "Empreendedorismo feminino", "Atividades comunitárias gratuitas"],
    source: "https://mapacultural.secult.ce.gov.br/projeto/7429/",
  },
  {
    id: "7512",
    title: "Conexão Profissional",
    subtitle: "Oficina de Formação em Instalação Elétrica Predial",
    axis: "Qualificação técnica e trabalho",
    image: "/images/projects/7512.jpg",
    icon: Wrench,
    period: "25/05/2026 a 29/05/2026",
    place: "Pereiro/CE",
    audience: "Jovens, trabalhadores, homens, mulheres e população da zona rural",
    value: "Não informado",
    summary:
      "Formação técnica inicial em instalações elétricas prediais, segurança, uso de ferramentas e práticas fundamentais para inserção produtiva.",
    highlights: ["Instalação elétrica predial", "Segurança e prevenção de acidentes", "Geração de renda"],
    source: "https://mapacultural.secult.ce.gov.br/projeto/7512/",
  },
  {
    id: "6738",
    title: "I Fórum de Lideranças Associativas",
    subtitle: "Governança, Legalidade e Estratégias de Captação de Recursos",
    axis: "Fortalecimento institucional",
    image: "/images/projects/6738.jpg",
    icon: Users,
    period: "24/05/2025",
    place: "Pereiro/CE",
    audience: "Lideranças comunitárias, associações, jovens, mulheres, idosos e zona rural",
    value: "Não informado",
    summary:
      "Encontro formativo para fortalecer associações e organizações da sociedade civil por meio de governança, gestão transparente, legalidade e captação de recursos.",
    highlights: ["Associativismo", "Gestão transparente", "Redes comunitárias"],
    source: "https://mapacultural.secult.ce.gov.br/projeto/6738/",
  },
  {
    id: "6605",
    title: "Workshop para Fortalecimento Institucional do Terceiro Setor",
    subtitle: "Estratégias Contemporâneas para Captação de Recursos e Sustentabilidade Organizacional",
    axis: "Terceiro Setor e sustentabilidade",
    image: "/images/projects/6605.jpg",
    icon: Users,
    period: "10/04/2025",
    place: "Pereiro/CE",
    audience: "Gestores sociais, lideranças, OSCs, coletivos, estudantes e comunidade interessada",
    value: "Não informado",
    summary:
      "Ação formativa sobre gestão organizacional, sustentabilidade institucional, elaboração de projetos, políticas públicas e mecanismos de financiamento.",
    highlights: ["Captação de recursos", "Sustentabilidade institucional", "Elaboração de projetos"],
    source: "https://mapacultural.secult.ce.gov.br/projeto/6605/",
  },
];

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <header className="border-b border-[var(--brand-border)] bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <PublicBrand />
          <div className="hidden items-center gap-7 text-sm font-medium text-[var(--brand-muted)] md:flex">
            <Link className="hover:text-[var(--brand-teal)]" href="/quem-somos">
              Quem somos
            </Link>
            <Link className="hover:text-[var(--brand-teal)]" href="/areas-de-atuacao">
              Áreas de atuação
            </Link>
            <Link className="hover:text-[var(--brand-teal)]" href="/transparencia">
              Transparência
            </Link>
            <Link className="hover:text-[var(--brand-teal)]" href="/contato">
              Contato
            </Link>
          </div>
          <Link
            href="/contato"
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Fale conosco
          </Link>
        </nav>
      </header>

      <section className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Portfólio de projetos</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Iniciativas do Instituto Incentive em cultura, trabalho e desenvolvimento social.
            </h1>
          </div>
          <p className="text-base leading-8 text-[var(--brand-muted)]">
            Os projetos reúnem ações de formação cultural, qualificação profissional, economia criativa e fortalecimento
            institucional do Terceiro Setor, com foco territorial em Pereiro/CE e prioridade para públicos em situação de
            vulnerabilidade social.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
            <p className="text-3xl font-bold text-[var(--brand-teal)]">5</p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-text)]">projetos organizados</p>
          </div>
          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
            <p className="text-3xl font-bold text-[var(--brand-teal)]">3</p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-text)]">eixos de atuação</p>
          </div>
          <div className="rounded-lg border border-[var(--brand-border)] bg-white p-5">
            <p className="text-3xl font-bold text-[var(--brand-teal)]">Pereiro/CE</p>
            <p className="mt-2 text-sm font-semibold text-[var(--brand-text)]">território prioritário</p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-16 sm:px-8">
        {projects.map((project) => {
          const Icon = project.icon;
          const isLogoImage = project.image === "/images/projects/7510.png";

          return (
            <article key={project.id} className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white shadow-sm">
              <div className="grid lg:grid-cols-[0.95fr_1.25fr]">
                <div className={isLogoImage ? "relative min-h-72 bg-white" : "relative min-h-72 bg-[var(--brand-tint)]"}>
                  <Image
                    src={project.image}
                    alt={`Imagem do projeto ${project.title}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className={isLogoImage ? "object-contain p-2 sm:p-4" : "object-cover"}
                  />
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-teal)]">
                      <Icon size={16} />
                      {project.axis}
                    </span>
                    <span className="rounded-lg bg-[var(--brand-orange-soft)] px-3 py-2 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                      Projeto {project.id}
                    </span>
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-[var(--brand-text)] sm:text-3xl">{project.title}</h2>
                  <p className="mt-2 text-base font-semibold text-[var(--brand-muted)]">{project.subtitle}</p>
                  <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">{project.summary}</p>

                  <div className="mt-6 grid gap-3 text-sm text-[var(--brand-muted)] sm:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                      <span>{project.period}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                      <span>{project.place}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                      <span>{project.audience}</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CircleDollarSign className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
                      <span>{project.value}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-2">
                    {project.highlights.map((highlight) => (
                      <div key={highlight} className="flex items-center gap-3 text-sm font-medium text-[var(--brand-text)]">
                        <CheckCircle2 className="shrink-0 text-[var(--brand-teal)]" size={18} />
                        {highlight}
                      </div>
                    ))}
                  </div>

                  <a
                    href={project.source}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
                  >
                    Ver no Mapa Cultural
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
