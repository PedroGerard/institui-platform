import type { Metadata } from "next";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { buildPageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site-config";
import {
  ArrowUpRight,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

export const metadata: Metadata = buildPageMetadata({
  title: "Contato",
  description:
    "Entre em contato com o Instituto Incentive em Pereiro/CE para dúvidas, propostas de parcerias, projetos e informações institucionais.",
  path: "/contato",
});

const faqItems = [
  {
    question: "Onde o Instituto Incentive está sediado?",
    answer: "A sede do Instituto fica localizada na Avenida José Milton de Morais, nº 394, Bairro Vila Nova, no município de Pereiro/CE, CEP 63.460-000.",
  },
  {
    question: "Como solicitar informações para auditoria ou órgãos de controle?",
    answer: "Solicitações formais de documentos, certidões ou esclarecimentos sobre projetos podem ser enviadas diretamente para contato@institutoincentive.org.br ou via Portal da Transparência.",
  },
  {
    question: "Como propor parcerias ou apoio a projetos?",
    answer: "Propostas de patrocínio, cooperação técnica, editais ou voluntariado podem ser apresentadas pelo formulário desta página ou pelo canal direto de e-mail.",
  },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-surface)] text-[var(--brand-text)]">
      <PublicHeader />

      <section id="conteudo-principal" className="border-b border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[var(--brand-teal)]">
              Atendimento e Relacionamento
            </span>
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-[var(--brand-text)] sm:text-5xl">
              Canais Oficiais de Contato.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-muted)]">
              Fale diretamente com o Instituto Incentive para tratar de projetos sociais e culturais, termos de parceria, convênios, prestação de contas ou informações institucionais.
            </p>

            <div className="mt-8 grid gap-4">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-4 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 transition hover:border-[var(--brand-teal)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                  <Mail size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">E-mail Institucional</p>
                  <p className="break-all text-sm font-extrabold text-[var(--brand-text)] sm:text-base">{siteConfig.email}</p>
                </div>
              </a>

              <a
                href={siteConfig.phone.href}
                className="flex items-center gap-4 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 transition hover:border-[var(--brand-teal)]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                  <Phone size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">Telefone e Mensagens</p>
                  <p className="text-sm font-extrabold text-[var(--brand-text)] sm:text-base">{siteConfig.phone.label}</p>
                </div>
              </a>

              <div className="flex items-start gap-4 rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[var(--brand-tint)] text-[var(--brand-teal)]">
                  <MapPin size={22} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">Endereço da Sede</p>
                  <p className="text-sm font-semibold leading-6 text-[var(--brand-text)] sm:text-base">
                    {siteConfig.address.line}
                  </p>
                </div>
              </div>

              {siteConfig.socialProfiles.length > 0 ? (
                <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                  <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">Redes Sociais Oficiais</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {siteConfig.socialProfiles.map((profile) => (
                      <a
                        key={profile.name}
                        href={profile.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-xs font-bold text-[var(--brand-text)] shadow-sm transition hover:text-[var(--brand-teal)]"
                      >
                        {profile.label ?? profile.name}
                        <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          <div className="rounded-xl border border-[var(--brand-border)] bg-[var(--brand-tint)] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-[var(--brand-teal)] shadow-sm">
              <MessageSquare size={24} />
            </div>
            <h2 className="mt-4 text-2xl font-extrabold text-[var(--brand-text)]">Envie sua Mensagem</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Preencha os campos abaixo para abrir uma mensagem direta via cliente de e-mail oficial:
            </p>

            <form
              className="mt-6 grid gap-4"
              action={`mailto:${siteConfig.email}`}
              method="GET"
            >
              <label className="grid gap-2 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-text)]">
                Nome Completo / Organização
                <input
                  name="subject"
                  className="rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="Seu nome ou instituição"
                  required
                />
              </label>

              <label className="grid gap-2 text-xs font-extrabold uppercase tracking-wide text-[var(--brand-text)]">
                Mensagem ou Proposta
                <textarea
                  name="body"
                  className="min-h-36 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm font-normal outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="Descreva o motivo do contato, proposta de parceria ou pedido de informação institucional."
                  required
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Enviar via E-mail
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="bg-[var(--brand-surface)] py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="max-w-3xl">
            <p className="text-sm font-extrabold uppercase text-[var(--brand-orange-dark)]">Dúvidas Frequentes</p>
            <h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Perguntas Comuns</h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {faqItems.map((item) => (
              <article key={item.question} className="rounded-xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <HelpCircle className="text-[var(--brand-teal)]" size={24} />
                <h3 className="mt-3 text-base font-extrabold text-[var(--brand-text)]">{item.question}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">{item.answer}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
