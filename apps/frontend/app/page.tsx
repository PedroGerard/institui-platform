import Image from "next/image";
import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Facebook,
  FileSearch,
  Globe,
  GraduationCap,
  Instagram,
  Landmark,
  Leaf,
  Linkedin,
  Mail,
  MapPin,
  Music2,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
  Youtube,
} from "lucide-react";

const heroImage =
  "https://images.pexels.com/photos/8777800/pexels-photo-8777800.jpeg?auto=compress&cs=tinysrgb&w=2200";

const impactHighlights = [
  {
    label: "Desde 2001",
    text: "Atuação social com origem em Pereiro, Ceará.",
  },
  {
    label: "10 áreas",
    text: "Educação, cultura, inclusão, tecnologia, sustentabilidade e governança.",
  },
  {
    label: "Transparência",
    text: "Informação pública organizada para fortalecer confiança e controle social.",
  },
];

const focusAreas = [
  {
    icon: GraduationCap,
    title: "Educação e inclusão",
    text: "Projetos que ampliam oportunidades de aprendizagem, formação profissional e protagonismo comunitário.",
    image: "https://images.pexels.com/photos/6238082/pexels-photo-6238082.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Estudantes diversos conversando após uma atividade de aprendizagem",
  },
  {
    icon: Music2,
    title: "Cultura e território",
    text: "Iniciativas culturais que valorizam identidades locais, economia criativa e acesso democrático à arte.",
    image: "https://images.pexels.com/photos/9211779/pexels-photo-9211779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Apresentação cultural brasileira com artistas em trajes coloridos",
  },
  {
    icon: Leaf,
    title: "Sustentabilidade",
    text: "Ações para educação ambiental, desenvolvimento rural sustentável e proteção de recursos naturais.",
    image: "https://images.pexels.com/photos/35450789/pexels-photo-35450789.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Paisagem do sertão com cactos ao pôr do sol",
  },
  {
    icon: ShieldCheck,
    title: "Governança social",
    text: "Apoio à organização de projetos, transparência, parcerias e boas práticas no Terceiro Setor.",
    image: "https://images.pexels.com/photos/7441079/pexels-photo-7441079.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Profissionais colaborando em uma reunião institucional",
  },
];

const steps = [
  "Mapear necessidades do território e oportunidades de parceria",
  "Estruturar projetos com metas, documentação e governança",
  "Mobilizar redes públicas, privadas e comunitárias",
  "Acompanhar resultados com transparência e foco em impacto",
];

const featuredProjects = [
  {
    title: "Sons do Sertão",
    text: "Formação musical comunitária com oficinas gratuitas de violão, recital público e acervo permanente.",
    image: "/images/projects/7510.png",
  },
  {
    title: "Beleza Criativa",
    text: "Capacitação em manicure e pedicure para fortalecer autonomia, empreendedorismo e geração de renda.",
    image: "/images/projects/7429.jpg",
  },
  {
    title: "Conexão Profissional",
    text: "Formação inicial em instalação elétrica predial para ampliar oportunidades de trabalho e renda.",
    image: "/images/projects/7512.jpg",
  },
];

const audiences = [
  {
    icon: FileSearch,
    title: "Projetos bem estruturados",
    text: "Organização de propostas, narrativas, evidências e materiais para fortalecer iniciativas sociais.",
  },
  {
    icon: Landmark,
    title: "Parcerias responsáveis",
    text: "Conexão entre poder público, empresas, sociedade civil e comunidades com foco em interesse público.",
  },
  {
    icon: Users,
    title: "Comunidades protagonistas",
    text: "Ações que valorizam autonomia, participação social, diversidade e desenvolvimento local.",
  },
];

const socialChannels = [
  { name: "Instagram", icon: Instagram },
  { name: "Facebook", icon: Facebook },
  { name: "LinkedIn", icon: Linkedin },
  { name: "YouTube", icon: Youtube },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <header className="sticky top-0 z-30 border-b border-[var(--brand-border)] bg-[rgba(246,246,246,0.94)] backdrop-blur">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <PublicBrand variant="wordmark" />

          <div className="hidden items-center gap-5 text-sm font-semibold text-[var(--brand-muted)] md:flex">
            <Link className="transition hover:text-[var(--brand-teal)]" href="/quem-somos">
              Quem somos
            </Link>
            <Link className="transition hover:text-[var(--brand-teal)]" href="/areas-de-atuacao">
              Áreas de atuação
            </Link>
            <Link className="transition hover:text-[var(--brand-teal)]" href="/projetos">
              Projetos
            </Link>
            <Link className="transition hover:text-[var(--brand-teal)]" href="/transparencia">
              Transparência
            </Link>
            <Link className="transition hover:text-[var(--brand-teal)]" href="/contato">
              Contato
            </Link>
          </div>

          <Link
            href="/contato"
            aria-label="Fale conosco"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-4 py-2 text-sm font-bold text-white shadow-sm shadow-[rgba(0,104,113,0.20)] transition hover:bg-[var(--brand-teal-dark)]"
          >
            <Mail size={17} />
            <span className="hidden sm:inline">Fale conosco</span>
          </Link>
        </nav>
      </header>

      <section className="relative min-h-[76svh] overflow-hidden bg-[var(--brand-teal-deep)]">
        <img
          src={heroImage}
          alt="Crianças em ação comunitária segurando copos em uma atividade social"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,63,68,0.96)_0%,rgba(0,104,113,0.84)_44%,rgba(0,104,113,0.30)_75%,rgba(0,104,113,0.10)_100%)]" />

        <div className="relative mx-auto flex min-h-[76svh] max-w-7xl items-center px-5 py-16 sm:px-8">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/12 px-3 py-2 text-sm font-bold text-white backdrop-blur">
              <Sparkles size={17} />
              Inovação, desenvolvimento e transformação social desde 2001
            </div>

            <h1 className="max-w-4xl text-4xl font-extrabold leading-[1.06] text-white sm:text-5xl lg:text-6xl">
              Transformação social com educação, cultura e inovação no território.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-light-surface)] sm:text-xl">
              O Instituto Incentive fortalece pessoas, comunidades e organizações por meio de projetos inclusivos,
              parcerias responsáveis e uma gestão comprometida com transparência.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/projetos"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange)] px-5 py-3 text-sm font-bold text-[var(--brand-text)] shadow-sm shadow-[rgba(0,0,0,0.20)] transition hover:bg-[var(--brand-orange-light)]"
              >
                Conheça os projetos
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/areas-de-atuacao"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/32 bg-white/14 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/22"
              >
                Áreas de atuação
              </Link>
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/32 bg-white/14 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/22"
              >
                Transparência
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {impactHighlights.map((item) => (
                <div key={item.label} className="rounded-lg border border-white/18 bg-white/12 p-4 backdrop-blur">
                  <p className="text-2xl font-extrabold text-[var(--brand-orange-light)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-white">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-white" aria-label="Identidade visual do Instituto Incentive">
        <img
          src="/images/brand/instituto-incentive-pattern.svg"
          alt=""
          className="h-24 w-full object-cover sm:h-28 lg:h-32"
        />
      </section>

      <section id="sobre" className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Sobre o Instituto</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
              Um agente de mudança nascido em Pereiro para conectar oportunidades e reduzir desigualdades.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Instituto Incentive de Inovação, Desenvolvimento e Transformação Social atua para promover inclusão,
              educação, tecnologia, sustentabilidade, cultura, empreendedorismo e defesa de direitos.
            </p>
            <p>
              A organização trabalha com uma abordagem colaborativa, formando parcerias com instituições públicas,
              empresas, organizações da sociedade civil e lideranças comunitárias.
            </p>
            <Link
              href="/quem-somos"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] transition hover:text-[var(--brand-teal-dark)]"
            >
              Ver trajetória completa
              <ArrowUpRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section id="atuacao" className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Atuação</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
              Frentes integradas para criar impacto social com identidade, método e presença territorial.
            </h2>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {focusAreas.map((area) => {
              const Icon = area.icon;

              return (
                <article key={area.title} className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white shadow-sm">
                  <div className="relative h-44 bg-[var(--brand-tint)]">
                    <img src={area.image} alt={area.alt} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,104,113,0.05)_0%,rgba(0,63,68,0.52)_100%)]" />
                    <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[var(--brand-teal)] shadow-sm">
                      <Icon size={24} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-extrabold text-[var(--brand-text)]">{area.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{area.text}</p>
                  </div>
                </article>
              );
            })}
          </div>

          <Link
            href="/areas-de-atuacao"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
          >
            Ver todas as áreas
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-light)]">Como o impacto acontece</p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Um caminho claro para transformar diagnóstico, parceria e execução em resultado social.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-light-text)]">
              O Incentive organiza ideias, documentação, redes de apoio e comunicação pública para que cada iniciativa
              tenha mais consistência, alcance e confiança.
            </p>
          </div>

          <ol className="grid gap-3">
            {steps.map((step, index) => (
              <li key={step} className="flex items-center gap-4 rounded-lg border border-white/[0.12] bg-white/[0.07] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-orange-light)] text-sm font-extrabold text-[var(--brand-text)]">
                  {index + 1}
                </span>
                <span className="text-sm font-semibold leading-6 text-[var(--brand-light-surface)] sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-16 sm:px-8 lg:grid-cols-3">
          {audiences.map((audience) => {
            const Icon = audience.icon;

            return (
              <article key={audience.title} className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6">
                <Icon className="text-[var(--brand-teal)]" size={28} />
                <h3 className="mt-4 text-xl font-extrabold text-[var(--brand-text)]">{audience.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{audience.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Projetos</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
                Iniciativas que conectam formação, cultura e desenvolvimento social.
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Ver todos os projetos
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const isLogoImage = project.image === "/images/projects/7510.png";

              return (
                <Link
                  key={project.title}
                  href="/projetos"
                  className="group overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white shadow-sm transition hover:border-[var(--brand-teal)]"
                >
                  <div className={isLogoImage ? "relative h-52 bg-white" : "relative h-52 bg-[var(--brand-tint)]"}>
                    <Image
                      src={project.image}
                      alt={`Imagem do projeto ${project.title}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={
                        isLogoImage
                          ? "object-contain p-2 transition duration-300 group-hover:scale-[1.03]"
                          : "object-cover transition duration-300 group-hover:scale-[1.03]"
                      }
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-extrabold text-[var(--brand-text)]">{project.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[var(--brand-muted)]">{project.text}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contato" className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Contato</p>
            <h2 className="mt-3 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
              Vamos conversar sobre projetos, parcerias e impacto social.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--brand-muted)]">
              Use os canais oficiais para falar sobre iniciativas, documentação institucional, parcerias e ações no
              território.
            </p>

            <div className="mt-7">
              <p className="text-sm font-bold uppercase text-[var(--brand-orange-dark)]">Redes sociais</p>
              <div className="mt-3 flex flex-wrap gap-3">
                {socialChannels.map((channel) => {
                  const Icon = channel.icon;

                  return (
                    <div
                      key={channel.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm font-bold text-[var(--brand-text)]"
                    >
                      <Icon size={18} className="text-[var(--brand-teal)]" />
                      {channel.name}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            <a
              href="https://institutoincentive.org.br/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Globe className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-bold sm:text-base">institutoincentive.org.br</span>
            </a>
            <a
              href="mailto:contato@institutoincentive.org.br"
              className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-bold sm:text-base">contato@institutoincentive.org.br</span>
            </a>
            <a
              href="tel:+5588999252123"
              className="flex items-center gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
            >
              <Phone className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="text-sm font-bold sm:text-base">+55 (88) 99925-2123</span>
            </a>
            <div className="flex items-start gap-4 rounded-lg border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)]">
              <MapPin className="mt-1 shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="text-sm font-bold leading-6 sm:text-base">
                Avenida José Milton de Morais, 394, Vila Nova - Pereiro/CE - CEP 63.460-000
              </span>
            </div>
            <div className="mt-2 flex items-start gap-3 text-sm leading-6 text-[var(--brand-muted)]">
              <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={18} />
              <span>Comunicação institucional alinhada ao domínio oficial institutoincentive.org.br.</span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[var(--brand-text)] px-5 py-6 text-sm text-[var(--brand-light-text)] sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span className="inline-flex items-center gap-3 font-bold text-white">
            <Image
              src="/images/brand/instituto-incentive-symbol.png"
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-contain"
            />
            Instituto Incentive
          </span>
          <div className="flex flex-wrap gap-3">
            {socialChannels.map((channel) => {
              const Icon = channel.icon;

              return (
                <span key={channel.name} className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Icon size={17} />
                  <span className="sr-only">{channel.name}</span>
                </span>
              );
            })}
          </div>
          <span>institutoincentive.org.br</span>
        </div>
      </footer>
    </main>
  );
}
