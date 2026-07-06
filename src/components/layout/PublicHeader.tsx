"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, HeartHandshake, Menu, ShieldCheck, X } from "lucide-react";
import { trackSiteEvent } from "@/lib/analytics";
import { PublicBrand } from "./PublicBrand";

const primaryNavLinks = [
  { href: "/", label: "Início" },
  { href: "/quem-somos", label: "Quem somos" },
  { href: "/areas-de-atuacao", label: "Áreas de atuação" },
  { href: "/projetos", label: "Projetos" },
  { href: "/certificacoes-reconhecimentos", label: "Certificações" },
  { href: "/contato", label: "Contato" },
];

const transparencyLinks = [
  {
    href: "/transparencia",
    label: "Portal da Transparência",
    description: "Documentos, governança e prestação de contas.",
  },
  {
    href: "/transparencia/emendas-parlamentares",
    label: "Emendas Parlamentares",
    description: "Declarações anuais e posição pública de recebimento.",
  },
];

function isActiveLink(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PublicHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const transparencyActive = transparencyLinks.some((link) => isActiveLink(pathname, link.href));

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-white/95 shadow-sm shadow-[rgba(0,63,68,0.04)] backdrop-blur">
      <a
        href="#conteudo-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-[var(--brand-text)] focus:px-4 focus:py-3 focus:text-sm focus:font-bold focus:text-white focus:shadow-xl"
      >
        Ir para o conteúdo principal
      </a>
      <div className="h-1 bg-[linear-gradient(90deg,var(--brand-teal)_0%,var(--brand-teal)_52%,var(--brand-orange)_52%,var(--brand-orange)_100%)]" />
      <nav className="mx-auto flex min-h-[4.75rem] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <PublicBrand variant="wordmark" />

        <div className="hidden items-center gap-1 lg:flex">
          {primaryNavLinks.map((link) => {
            const active = isActiveLink(pathname, link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-bold transition ${
                  active
                    ? "bg-[var(--brand-tint)] text-[var(--brand-teal)]"
                    : "text-[var(--brand-muted)] hover:bg-[var(--brand-surface)] hover:text-[var(--brand-teal)]"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <div className="group relative">
            <button
              type="button"
              aria-haspopup="true"
              className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold transition ${
                transparencyActive
                  ? "bg-[var(--brand-tint)] text-[var(--brand-teal)]"
                  : "text-[var(--brand-muted)] hover:bg-[var(--brand-surface)] hover:text-[var(--brand-teal)]"
              }`}
            >
              Transparência
              <ChevronDown size={16} />
            </button>

            <div className="invisible absolute right-0 top-full z-50 mt-3 w-[23rem] rounded-lg border border-[var(--brand-border)] bg-white p-3 opacity-0 shadow-xl shadow-[rgba(0,63,68,0.14)] transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
              <div className="mb-2 flex items-center gap-2 rounded-lg bg-[var(--brand-tint)] px-3 py-2 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--brand-teal)]">
                <ShieldCheck size={15} />
                Consulta pública
              </div>
              {transparencyLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 transition ${
                      active
                        ? "bg-[var(--brand-surface)] text-[var(--brand-teal)]"
                        : "text-[var(--brand-text)] hover:bg-[var(--brand-surface)]"
                    }`}
                  >
                    <span className="block text-sm font-extrabold">{link.label}</span>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-[var(--brand-muted)]">
                      {link.description}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/apoie"
            onClick={() =>
              trackSiteEvent("cta_click", {
                cta: "header_support",
                target: "/apoie",
              })
            }
            className="hidden items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange)] px-4 py-2 text-sm font-bold text-[var(--brand-text)] shadow-sm shadow-[rgba(0,63,68,0.18)] transition hover:bg-[var(--brand-orange-light)] sm:inline-flex"
          >
            <HeartHandshake size={17} />
            Apoie
          </Link>
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--brand-border-strong)] bg-white text-[var(--brand-text)] transition hover:border-[var(--brand-teal)] hover:text-[var(--brand-teal)] lg:hidden"
            aria-expanded={isOpen}
            aria-controls="public-mobile-menu"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div id="public-mobile-menu" className="border-t border-[var(--brand-border)] bg-white px-5 py-4 shadow-lg shadow-[rgba(0,63,68,0.08)] lg:hidden">
          <div className="mx-auto grid max-w-7xl gap-2">
            {primaryNavLinks.map((link) => {
              const active = isActiveLink(pathname, link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-bold transition ${
                    active
                      ? "bg-[var(--brand-tint)] text-[var(--brand-teal)]"
                      : "text-[var(--brand-text)] hover:bg-[var(--brand-surface)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mt-3 rounded-lg border border-[var(--brand-border)] bg-[var(--brand-surface)] p-2">
              <p className="px-2 pb-1 text-xs font-extrabold uppercase tracking-[0.08em] text-[var(--brand-orange-dark)]">
                Transparência
              </p>
              {transparencyLinks.map((link) => {
                const active = isActiveLink(pathname, link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setIsOpen(false)}
                    className={`block rounded-lg px-3 py-3 text-sm font-bold transition ${
                      active
                        ? "bg-white text-[var(--brand-teal)]"
                        : "text-[var(--brand-text)] hover:bg-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <Link
              href="/apoie"
              onClick={() => {
                trackSiteEvent("cta_click", {
                  cta: "mobile_support_button",
                  target: "/apoie",
                });
                setIsOpen(false);
              }}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--brand-orange)] px-4 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:bg-[var(--brand-orange-light)]"
            >
              <HeartHandshake size={17} />
              Apoie o Instituto
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
