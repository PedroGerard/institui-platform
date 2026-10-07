import Image from "next/image";
import Link from "next/link";
import { TrackedAnchor } from "@/components/analytics/TrackedAnchor";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { siteConfig } from "@/lib/site-config";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  Briefcase,
  CheckCircle2,
  Compass,
  Globe,
  GraduationCap,
  Heart,
  HeartHandshake,
  Landmark,
  Lightbulb,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const heroSlides = [
  {
    src: "/images/instituto-incentive-hero.png",
    alt: "Comunidade e ações de desenvolvimento territorial do Instituto Incentive",
  },
  {
    src: "https://images.pexels.com/photos/8777800/pexels-photo-8777800.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Pessoas unidas em ação comunitária no território",
  },
  {
    src: "https://images.pexels.com/photos/33766496/pexels-photo-33766496.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Inclusão digital e capacitação de jovens no semiárido",
  },
];

const pillars = [
  {
    icon: Compass,
    title: "Desenvolvimento Territorial",
    text: "Soluções integradas e perenes desenhadas com base nas vocações, desafios e saberes das comunidades do semiárido cearense.",
  },
  {
    icon: Lightbulb,
    title: "Inovação e Tecnologia Social",
    text: "Metodologias contemporâneas e replicáveis para enfrentar desigualdades em educação, trabalho, cultura e inclusão socioprodutiva.",
  },
  {
    icon: ShieldCheck,
    title: "Governança e Integridade",
    text: "Compliance estatutário rigoroso, segregação de funções, dupla autorização e transparência ativa permanente para controle social.",
  },
  {
    icon: HeartHandshake,
    title: "Articulação em Redes",
    text: "Cooperação multissetorial conectando governos, empresas com responsabilidade social, universidades e organizações de base.",
  },
];

const featuredAxes = [
  {
    icon: Heart,
    axisNumber: "Eixo 01",
    title: "Proteção Social e Garantia de Direitos",
    desc: "Acolhimento socioassistencial gratuito e defesa de direitos para públicos em vulnerabilidade.",
  },
  {
    icon: Briefcase,
    axisNumber: "Eixo 02",
    title: "Inclusão Socioprodutiva e Renda",
    desc: "Formação técnica, economia solidária e geração de renda para mulheres e jovens.",
  },
  {
    icon: GraduationCap,
    axisNumber: "Eixo 04",
    title: "Educação, Cultura e Esporte",
    desc: "Oficinas culturais, musicalização comunitária e qualificação profissional acessível.",
  },
  {
    icon: Landmark,
    axisNumber: "Eixo 08",
    title: "Fortalecimento do Terceiro Setor",
    desc: "Capacitação de lideranças associativas em governança, captação de recursos e compliance.",
  },
];

const featuredProjects = [
  {
    id: "7510",
    title: "Sons do Sertão",
    axis: "Cultura e Formação",
    image: "/images/projects/7510.png",
    text: "12 oficinas gratuitas de violão para crianças e adolescentes no Bairro Vila Nova em Pereiro/CE, com recital público e acervo de 10 violões.",
  },
  {
    id: "7429",
    title: "Beleza Criativa",
    axis: "Inclusão Produtiva",
    image: "/images/projects/7429.jpg",
    text: "Capacitação prática em técnicas de manicure e pedicure para mulheres e jovens, impulsionando a autonomia financeira e o microempreendedorismo.",
  },
  {
    id: "6738",
    title: "I Fórum de Lideranças Associativas",
    axis: "Fortalecimento Institucional",
    image: "/images/projects/6738.jpg",
    text: "Encontro formativo para capacitar associações comunitárias em governança, legalidade, MROSC e estratégias contemporâneas de captação.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      {/* HERO SECTION */}
      <section id="conteudo-principal" className="relative overflow-hidden bg-[var(--brand-text)] text-white">
        <div className="absolute inset-0 overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.src}
              className="hero-carousel-slide absolute inset-0"
              style={{ animationDelay: `${index * 8}s` }}
            >
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover object-center opacity-40"
              />
            </div>
          ))}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,63,68,0.95)_0%,rgba(0,104,113,0.80)_52%,rgba(0,63,68,0.30)_100%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[70svh] max-w-7xl items-center gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white backdrop-blur">
              <Sparkles size={16} className="text-[var(--brand-orange-light)]" />
              Desenvolvimento Territorial • Inovação Social
            </div>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Transformação Social com Raízes no Semiárido.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--brand-light-surface)]">
              O <strong>Instituto Incentive</strong> é uma Organização da Sociedade Civil (OSC) fundada em 2001 em Pereiro/CE, dedicada a estruturar soluções integradas de educação, cultura, inclusão socioprodutiva e fortalecimento comunitário.
            </p>
            <div className="mt-9 flex flex-col gap-3.5 sm:flex-row">
              <Link
                href="/projetos"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[rgba(0,0,0,0.25)] transition hover:bg-[var(--brand-teal-dark)]"
              >
                Conhecer Projetos
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/transparencia"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/30 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/20"
              >
                Portal da Transparência
              </Link>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <span className="text-3xl font-extrabold text-[var(--brand-orange-light)]">2001</span>
              <p className="mt-1 text-sm font-bold">Fundação Oficial</p>
              <p className="mt-1 text-xs text-[var(--brand-light-text)]">25 anos de atuação comunitária em Pereiro/CE e no Vale do Jaguaribe.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <span className="text-3xl font-extrabold text-[var(--brand-orange-light)]">8</span>
              <p className="mt-1 text-sm font-bold">Eixos Programáticos</p>
              <p className="mt-1 text-xs text-[var(--brand-light-text)]">Matriz multidisciplinar aprovada no novo Estatuto Social.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <span className="text-3xl font-extrabold text-[var(--brand-orange-light)]">100%</span>
              <p className="mt-1 text-sm font-bold">Gratuidade Pública</p>
              <p className="mt-1 text-xs text-[var(--brand-light-text)]">Serviços socioassistenciais e formação cultural sem exigência de filiação.</p>
            </div>
            <div className="rounded-xl border border-white/15 bg-white/10 p-5 backdrop-blur">
              <span className="text-3xl font-extrabold text-[var(--brand-orange-light)]">Ativa</span>
              <p className="mt-1 text-sm font-bold">Transparência Digital</p>
              <p className="mt-1 text-xs text-[var(--brand-light-text)]">Atos constitutivos, certidões e balanços de livre acesso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PILARES INSTITUCIONAIS */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Compromisso Institucional</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
              Pilares que Orientam Nossa Estratégia de Impacto.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              A atuação do Instituto Incentive afasta-se de modelos assistencialistas genéricos para construir autonomia, capacidades comunitárias e soluções sustentáveis no território:
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;

              return (
                <article key={pillar.title} className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-6 shadow-sm transition duration-200 hover:border-[var(--brand-teal)] hover:shadow-md">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                    <Icon size={24} />
                  </div>
                  <h3 className="mt-5 text-lg font-extrabold text-[var(--brand-text)]">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{pillar.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* EIXOS PROGRAMÁTICOS EM DESTAQUE */}
      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Áreas de Atuação</p>
              <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">
                8 Eixos Estratégicos de Desenvolvimento.
              </h2>
            </div>
            <Link
              href="/areas-de-atuacao"
              className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)]"
            >
              Ver todos os 8 eixos
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {featuredAxes.map((axis) => {
              const Icon = axis.icon;

              return (
                <article key={axis.axisNumber} className="rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                      <Icon size={20} />
                    </div>
                    <span className="rounded-md bg-[var(--brand-orange-soft)] px-2.5 py-0.5 text-xs font-bold uppercase text-[var(--brand-orange-dark)]">
                      {axis.axisNumber}
                    </span>
                  </div>
                  <h3 className="mt-4 text-base font-extrabold text-[var(--brand-text)]">{axis.title}</h3>
                  <p className="mt-2 text-xs leading-5 text-[var(--brand-muted)]">{axis.desc}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* PROJETOS EM DESTAQUE */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Projetos no Território</p>
              <h2 className="mt-2 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
                Ações Concretas de Cultura, Trabalho e Formação.
              </h2>
            </div>
            <Link
              href="/projetos"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
            >
              Ver Todos os Projetos
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {featuredProjects.map((project) => {
              const isLogo = project.image === "/images/projects/7510.png";

              return (
                <article
                  key={project.id}
                  className="flex flex-col justify-between overflow-hidden rounded-xl border border-[var(--brand-border)] bg-white shadow-sm transition hover:border-[var(--brand-teal)] hover:shadow-md"
                >
                  <div>
                    <div className={isLogo ? "relative h-52 bg-white flex items-center justify-center p-4" : "relative h-52 bg-[var(--brand-tint)]"}>
                      <Image
                        src={project.image}
                        alt={`Projeto ${project.title}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className={isLogo ? "object-contain p-2" : "object-cover"}
                      />
                    </div>
                    <div className="p-6">
                      <span className="rounded-md bg-[var(--brand-tint)] px-2.5 py-1 text-xs font-bold uppercase text-[var(--brand-teal)]">
                        {project.axis}
                      </span>
                      <h3 className="mt-3 text-xl font-extrabold text-[var(--brand-text)]">{project.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{project.text}</p>
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Link
                      href="/projetos"
                      className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)]"
                    >
                      Ver detalhes
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOCO DE TRANSPARÊNCIA E CERTIFICAÇÕES */}
      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-xl border border-[var(--brand-border)] bg-white p-8 shadow-sm">
              <ShieldCheck className="text-[var(--brand-teal)]" size={36} />
              <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-text)]">Portal da Transparência</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                Acesse o Estatuto Social reformado, atas de eleição e posse, certidões negativas de débitos, demonstrações financeiras e declarações de emendas parlamentares.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/transparencia"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
                >
                  Acessar Documentos
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/transparencia/emendas-parlamentares"
                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-5 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)]"
                >
                  Emendas Parlamentares
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--brand-border)] bg-white p-8 shadow-sm">
              <Award className="text-[var(--brand-teal)]" size={36} />
              <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-text)]">Certificações e Qualificação</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--brand-muted)]">
                O Instituto Incentive é reconhecido no Cadastro Nacional de Pontos de Cultura (MinC), possui certificações CADASTUR e declaração do DCSOL em Economia Solidária.
              </p>
              <div className="mt-6">
                <Link
                  href="/certificacoes-reconhecimentos"
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
                >
                  Ver Certificações Oficiais
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTATO E REDES */}
      <section id="contato" className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)] py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Relacionamento Institucional</p>
            <h2 className="mt-2 text-3xl font-extrabold text-[var(--brand-text)] sm:text-4xl">
              Vamos dialogar sobre projetos, parcerias e impacto social.
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--brand-muted)]">
              Utilize os canais oficiais do Instituto Incentive para apresentar editais, propostas de cooperação ou solicitar informações públicas.
            </p>

            {siteConfig.socialProfiles.length > 0 ? (
              <div className="mt-8">
                <p className="text-xs font-extrabold uppercase tracking-wider text-[var(--brand-orange-dark)]">Redes Sociais Oficiais</p>
                <div className="mt-3 flex flex-wrap gap-2.5">
                  {siteConfig.socialProfiles.map((channel) => (
                    <TrackedAnchor
                      key={channel.name}
                      href={channel.href}
                      target="_blank"
                      rel="noreferrer"
                      eventName="social_link_click"
                      eventProperties={{ network: channel.name, page: "home" }}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--brand-text)] shadow-sm transition hover:border-[var(--brand-teal)]"
                    >
                      {channel.label ?? channel.name}
                      <ArrowUpRight size={14} className="text-[var(--brand-teal)]" />
                    </TrackedAnchor>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="grid gap-3.5">
            <TrackedAnchor
              href={siteConfig.url}
              target="_blank"
              rel="noreferrer"
              eventName="contact_channel_click"
              eventProperties={{ channel: "site", page: "home" }}
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] shadow-sm transition hover:border-[var(--brand-teal)]"
            >
              <Globe className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-bold sm:text-base">{siteConfig.domain}</span>
            </TrackedAnchor>
            <TrackedAnchor
              href={`mailto:${siteConfig.email}`}
              eventName="contact_channel_click"
              eventProperties={{ channel: "email", page: "home" }}
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] shadow-sm transition hover:border-[var(--brand-teal)]"
            >
              <Mail className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="break-all text-sm font-bold sm:text-base">{siteConfig.email}</span>
            </TrackedAnchor>
            <TrackedAnchor
              href={siteConfig.phone.href}
              eventName="contact_channel_click"
              eventProperties={{ channel: "phone", page: "home" }}
              className="flex items-center gap-4 rounded-xl border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] shadow-sm transition hover:border-[var(--brand-teal)]"
            >
              <Phone className="shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="text-sm font-bold sm:text-base">{siteConfig.phone.label}</span>
            </TrackedAnchor>
            <div className="flex items-start gap-4 rounded-xl border border-[var(--brand-border-strong)] bg-white p-4 text-[var(--brand-text)] shadow-sm">
              <MapPin className="mt-1 shrink-0 text-[var(--brand-teal)]" size={22} />
              <span className="text-sm font-semibold leading-6 sm:text-base">
                {siteConfig.address.line}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-2 text-xs font-bold text-[var(--brand-muted)]">
              <CheckCircle2 className="shrink-0 text-[var(--brand-teal)]" size={16} />
              <span>Domínio oficial e canais de atendimento verificados.</span>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
