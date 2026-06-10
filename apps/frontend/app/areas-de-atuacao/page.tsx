import Link from "next/link";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Landmark,
  Leaf,
  Palette,
  Rocket,
  Scale,
  ShieldCheck,
  Sprout,
  Users,
} from "lucide-react";

const areas = [
  {
    icon: HandHeart,
    title: "Inclusão Social e Assistência Social",
    description: "Ações voltadas à proteção social, fortalecimento comunitário e ampliação de oportunidades.",
    items: [
      "Apoio a projetos sociais e ambientais voltados para populações em situação de vulnerabilidade.",
      "Desenvolvimento de programas de assistência social e fortalecimento comunitário.",
      "Promoção de inclusão digital e capacitação profissional para grupos marginalizados.",
      "Proteção e defesa de direitos de crianças, adolescentes, idosos e outros grupos vulneráveis.",
    ],
  },
  {
    icon: Scale,
    title: "Direitos Humanos e Diversidade",
    description: "Defesa da dignidade, igualdade, diversidade e acesso universal a direitos fundamentais.",
    items: [
      "Combate à violência de gênero e proteção de vítimas.",
      "Promoção da igualdade racial, cultural e de gênero.",
      "Apoio e fortalecimento de comunidades LGBTQIAPN+.",
      "Defesa do acesso universal a serviços de saúde, educação e oportunidades econômicas.",
    ],
  },
  {
    icon: GraduationCap,
    title: "Educação, Pesquisa e Desenvolvimento",
    description: "Formação, pesquisa, aprendizagem e inovação educacional para desenvolvimento social.",
    items: [
      "Formação e capacitação de professores e profissionais da educação.",
      "Desenvolvimento de pesquisas científicas e tecnológicas.",
      "Criação de programas educacionais voltados para a inclusão social e inovação.",
      "Promoção do estágio e aprendizagem para jovens.",
    ],
  },
  {
    icon: Rocket,
    title: "Tecnologia e Inovação",
    description: "Soluções tecnológicas, transformação digital e empreendedorismo inovador.",
    items: [
      "Desenvolvimento de tecnologias sustentáveis e soluções inovadoras.",
      "Promoção de cidades inteligentes e transformação digital.",
      "Incentivo à capacitação em tecnologia e áreas emergentes.",
      "Apoio a startups e fomento ao empreendedorismo tecnológico.",
    ],
  },
  {
    icon: Sprout,
    title: "Agricultura Familiar e Desenvolvimento Rural Sustentável",
    description: "Fortalecimento da economia rural, segurança alimentar e tecnologias sociais no campo.",
    items: [
      "Apoio a produtores rurais e incentivo à agricultura familiar.",
      "Promoção de práticas agrícolas sustentáveis e segurança alimentar.",
      "Desenvolvimento de tecnologias sociais voltadas para o campo.",
      "Fomento à organização e fortalecimento da economia rural.",
    ],
  },
  {
    icon: Leaf,
    title: "Meio Ambiente, Sustentabilidade e Preservação da Fauna e Flora",
    description: "Educação ambiental, práticas sustentáveis e proteção de áreas naturais.",
    items: [
      "Desenvolvimento de programas de educação ambiental.",
      "Promoção de práticas sustentáveis e proteção de áreas naturais.",
      "Incentivo à reciclagem e redução de resíduos.",
      "Criação e manutenção de parques ecológicos e jardins zoológicos.",
    ],
  },
  {
    icon: HeartPulse,
    title: "Saúde e Bem-estar",
    description: "Cuidado integral, saúde pública, prevenção e promoção de qualidade de vida.",
    items: [
      "Promoção de políticas públicas de saúde e programas de segurança alimentar.",
      "Capacitação de profissionais da saúde e fortalecimento do SUS.",
      "Apoio à saúde mental e bem-estar da população.",
      "Implementação de programas de atenção básica e prevenção de doenças.",
    ],
  },
  {
    icon: Palette,
    title: "Cultura, Esporte, Arte, Lazer e Recreação",
    description: "Valorização cultural, economia criativa, esporte e lazer como caminhos de inclusão.",
    items: [
      "Apoio a artistas locais e incentivo à economia criativa.",
      "Desenvolvimento de projetos culturais e preservação do patrimônio histórico.",
      "Promoção de eventos esportivos e recreativos para inclusão social.",
      "Incentivo ao lazer e bem-estar em comunidades vulneráveis.",
    ],
  },
  {
    icon: Briefcase,
    title: "Economia Solidária e Empreendedorismo",
    description: "Inclusão produtiva, capacitação, acesso a oportunidades e negócios sustentáveis.",
    items: [
      "Apoio a microempresas e empreendedores de baixa renda.",
      "Promoção de capacitação profissional e inclusão produtiva.",
      "Facilitação do acesso a crédito e serviços financeiros para pequenos negócios.",
      "Incentivo a modelos de negócios sustentáveis e economia colaborativa.",
    ],
  },
  {
    icon: Landmark,
    title: "Gestão Organizacional e Governança",
    description: "Apoio técnico para transparência, eficiência, compliance e planejamento institucional.",
    items: [
      "Assessoria para instituições do terceiro setor em transparência e eficiência.",
      "Desenvolvimento de projetos de gestão para órgãos públicos e privados.",
      "Promoção de boas práticas em governança e compliance.",
      "Consultoria em planejamento estratégico e administração pública.",
    ],
  },
];

const areaImages = [
  {
    src: "https://images.pexels.com/photos/8777800/pexels-photo-8777800.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Amigos juntos em cumprimento celebrando diversidade.",
  },
  {
    src: "https://images.pexels.com/photos/7479900/pexels-photo-7479900.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Composicao com diversidade humana e tons de pele.",
  },
  {
    src: "https://images.pexels.com/photos/33766496/pexels-photo-33766496.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Estudante usando tablet em ambiente de aprendizagem.",
  },
  {
    src: "https://images.pexels.com/photos/5474296/pexels-photo-5474296.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Pessoa trabalhando em codigo no computador.",
  },
  {
    src: "https://images.pexels.com/photos/35450789/pexels-photo-35450789.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Paisagem desertica com cactos ao por do sol.",
  },
  {
    src: "https://images.pexels.com/photos/30710775/pexels-photo-30710775.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Parque arborizado com lago e vegetacao preservada.",
  },
  {
    src: "https://images.pexels.com/photos/36665085/pexels-photo-36665085.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Equipe de saude em ambiente hospitalar.",
  },
  {
    src: "https://images.pexels.com/photos/9211779/pexels-photo-9211779.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Apresentacao de danca colorida em celebracao cultural.",
  },
  {
    src: "https://images.pexels.com/photos/36733360/pexels-photo-36733360.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Profissionais em reuniao de negocios e empreendedorismo.",
  },
  {
    src: "https://images.pexels.com/photos/36972168/pexels-photo-36972168.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Equipe diversa em reuniao de planejamento e governanca.",
  },
];

export default function PracticeAreasPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <header className="border-b border-[var(--brand-border)] bg-white">
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
          <PublicBrand />
          <div className="flex items-center gap-3">
            <Link
              href="/quem-somos"
              className="hidden rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] sm:inline-flex"
            >
              Quem somos
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
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Áreas de atuação</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Frentes de trabalho para inclusão, inovação e desenvolvimento sustentável.
            </h1>
          </div>
          <div className="space-y-5 text-base leading-8 text-[var(--brand-muted)]">
            <p>
              O Instituto Incentive organiza sua atuação em frentes multidisciplinares, conectando assistência social,
              educação, direitos humanos, tecnologia, sustentabilidade, cultura e governança.
            </p>
            <p className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 text-sm font-semibold leading-6 text-[var(--brand-text)]">
              As áreas abaixo orientam projetos, parcerias, programas institucionais e iniciativas de impacto social.
            </p>
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--brand-border)] bg-[var(--brand-text)] text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-12 sm:px-8 md:grid-cols-3">
          <div>
            <Users className="text-[var(--brand-orange-light)]" size={30} />
            <h2 className="mt-4 text-2xl font-bold">10 áreas</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Um campo amplo de atuação social, ambiental, educacional, cultural e institucional.
            </p>
          </div>
          <div>
            <ShieldCheck className="text-[var(--brand-orange-light)]" size={30} />
            <h2 className="mt-4 text-2xl font-bold">Direitos e inclusão</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Prioridade para populações vulneráveis, diversidade, equidade e cidadania.
            </p>
          </div>
          <div>
            <Building2 className="text-[var(--brand-orange-light)]" size={30} />
            <h2 className="mt-4 text-2xl font-bold">Parcerias</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-light-text)]">
              Cooperação com poder público, empresas, organizações sociais e comunidades.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-5 lg:grid-cols-2">
          {areas.map((area, index) => {
            const Icon = area.icon;
            const visual = areaImages[index];

            return (
              <article key={area.title} className="overflow-hidden rounded-lg border border-[var(--brand-border)] bg-white shadow-sm">
                <div className="relative h-52 bg-[var(--brand-tint)]">
                  <img
                    src={visual.src}
                    alt={visual.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,104,113,0.04)_0%,rgba(0,63,68,0.68)_100%)]" />
                  <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-lg bg-white/95 text-[var(--brand-teal)] shadow-sm">
                    <Icon size={24} aria-hidden="true" />
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-[var(--brand-text)]">{area.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{area.description}</p>

                  <div className="mt-5 grid gap-3">
                    {area.items.map((item) => (
                      <div key={item} className="flex gap-3 text-sm leading-6 text-[var(--brand-muted)]">
                        <CheckCircle2 className="mt-0.5 shrink-0 text-[var(--brand-teal)]" size={17} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="border-t border-[var(--brand-border)] bg-[var(--brand-tint)]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">Quer desenvolver uma iniciativa com o Instituto?</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Entre em contato para conversar sobre projetos, parcerias e oportunidades de colaboração.
            </p>
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
