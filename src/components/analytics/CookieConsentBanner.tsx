"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  COOKIE_CONSENT_CHANGED_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  type CookieConsentValue,
} from "@/lib/cookie-consent";

type ConsentSnapshot = CookieConsentValue | "pending" | "loading";

function getStoredConsent(): ConsentSnapshot {
  if (typeof window === "undefined") {
    return "loading";
  }

  return (window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) as CookieConsentValue | null) ?? "pending";
}

function subscribeToConsent(callback: () => void) {
  window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function CookieConsentBanner() {
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, () => "loading");

  function saveConsent(value: CookieConsentValue) {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, value);
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
  }

  if (consent !== "pending") {
    return null;
  }

  return (
    <section
      aria-label="Preferencias de cookies"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[82svh] max-w-5xl overflow-y-auto rounded-lg border border-[var(--brand-border)] bg-white p-4 text-[var(--brand-text)] shadow-2xl sm:inset-x-4 sm:bottom-4 sm:p-5"
    >
      <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <h2 className="text-base font-bold">Preferências de privacidade</h2>
          <p className="mt-2 text-sm leading-6 text-[var(--brand-muted)]">
            Usamos medições essenciais e sem cookies para entender o desempenho do site. As
            ferramentas opcionais do Google Analytics/Tag Manager serão ativadas somente se você
            aceitar, ajudando a medir campanhas, formulários e acessos gerados pelo Google Ad Grants.
          </p>
          <Link
            href="/privacidade"
            className="mt-2 inline-flex text-sm font-bold text-[var(--brand-teal)] hover:text-[var(--brand-teal-dark)]"
          >
            Ver Política de Privacidade
          </Link>
        </div>

        <div className="grid gap-2 sm:flex sm:flex-wrap md:justify-end">
          <button
            type="button"
            onClick={() => saveConsent("rejected")}
            className="w-full rounded-lg border border-[var(--brand-border)] px-4 py-3 text-sm font-bold text-[var(--brand-text)] transition hover:bg-[var(--brand-surface)] sm:w-auto"
          >
            Recusar opcionais
          </button>
          <button
            type="button"
            onClick={() => saveConsent("accepted")}
            className="w-full rounded-lg bg-[var(--brand-teal)] px-4 py-3 text-sm font-bold text-white transition hover:bg-[var(--brand-teal-dark)] sm:w-auto"
          >
            Aceitar medições
          </button>
        </div>
      </div>
    </section>
  );
}
