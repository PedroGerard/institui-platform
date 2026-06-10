"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import { PublicBrand } from "@/components/layout/PublicBrand";
import {
  ArrowRight,
  Globe,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

const contacts = [
  {
    icon: Globe,
    label: "Site",
    value: "institutoincentive.org.br",
    href: "https://institutoincentive.org.br/",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@institutoincentive.org.br",
    href: "mailto:contato@institutoincentive.org.br",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "+55 (88) 99925-2123",
    href: "tel:+5588999252123",
  },
];

export default function ContactPage() {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const subject = String(formData.get("subject") || "Contato pelo site").trim();
    const message = String(formData.get("message") || "").trim();
    const body = [`Nome: ${name}`, `E-mail: ${email}`, "", "Mensagem:", message].join("\n");

    window.location.href = `mailto:contato@institutoincentive.org.br?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

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
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--brand-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)]"
            >
              Projetos
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-[var(--brand-orange-dark)]">Contato</p>
            <h1 className="mt-3 text-4xl font-bold leading-tight sm:text-5xl">
              Vamos conversar sobre projetos, parcerias e impacto social.
            </h1>
            <p className="mt-6 text-lg leading-8 text-[var(--brand-muted)]">
              Use os canais abaixo para falar com o Instituto Incentive sobre leis de incentivo, projetos culturais,
              qualificação profissional, Terceiro Setor e oportunidades de colaboração.
            </p>

            <div className="mt-8 grid gap-3">
              {contacts.map((contact) => {
                const Icon = contact.icon;

                return (
                  <a
                    key={contact.label}
                    href={contact.href}
                    target={contact.href.startsWith("http") ? "_blank" : undefined}
                    rel={contact.href.startsWith("http") ? "noreferrer" : undefined}
                    className="flex items-center gap-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4 transition hover:border-[var(--brand-teal)]"
                  >
                    <Icon className="shrink-0 text-[var(--brand-teal)]" size={22} />
                    <div>
                      <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">{contact.label}</p>
                      <p className="break-all text-sm font-semibold text-[var(--brand-text)] sm:text-base">{contact.value}</p>
                    </div>
                  </a>
                );
              })}

              <div className="flex items-start gap-4 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-4">
                <MapPin className="mt-1 shrink-0 text-[var(--brand-teal)]" size={22} />
                <div>
                  <p className="text-xs font-bold uppercase text-[var(--brand-muted)]">Endereço público</p>
                  <p className="text-sm font-semibold leading-6 text-[var(--brand-text)] sm:text-base">
                    Avenida José Milton de Morais, 394, Vila Nova - Pereiro/CE - CEP 63.460-000
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-[var(--brand-border)] bg-[var(--brand-tint)] p-6 sm:p-8">
            <MessageSquare className="text-[var(--brand-teal)]" size={32} />
            <h2 className="mt-4 text-2xl font-bold">Mensagem rápida</h2>
            <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
              Compartilhe seu contato, o tema da conversa e uma breve descrição da demanda.
            </p>

            <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-text)]">
                Nome
                <input
                  name="name"
                  className="rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="Seu nome"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-text)]">
                E-mail
                <input
                  name="email"
                  className="rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="seuemail@exemplo.com"
                  type="email"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-text)]">
                Assunto
                <input
                  name="subject"
                  className="rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="Projetos, parceria ou incentivo fiscal"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-[var(--brand-text)]">
                Mensagem
                <textarea
                  name="message"
                  className="min-h-36 rounded-lg border border-[var(--brand-border-strong)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--brand-teal)]"
                  placeholder="Conte brevemente como podemos ajudar."
                  required
                />
              </label>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-teal)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-teal-dark)]"
              >
                Enviar mensagem
                <Send size={17} />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
