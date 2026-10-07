$ErrorActionPreference = "Stop"

$repo = "C:\Users\user\Documents\instituto-incentive-site"
Set-Location $repo

$dirty = @(git status --porcelain=v1)
if ($dirty.Count -gt 0) {
  Write-Output "WORKTREE_DIRTY"
  git status --short
  exit 2
}

git switch main *> $null
git pull --ff-only origin main *> $null

$branchBase = "codex/formulario-contato-real-20260715"
$branches = @(git branch --format="%(refname:short)")
$branch = $branchBase
$i = 2
while ($branches -contains $branch) {
  $branch = "$branchBase-v$i"
  $i++
}

git switch -c $branch *> $null
Write-Output "branch=$branch"

$routeTs = @'
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const RESEND_EMAILS_URL = "https://api.resend.com/emails";
const MAX_MESSAGE_LENGTH = 4000;

type TurnstileResult = {
  success?: boolean;
};

function cleanText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = cleanText(body.name);
    const email = cleanText(body.email).toLowerCase();
    const subject = cleanText(body.subject);
    const message = cleanText(body.message);
    const turnstileToken = cleanText(body.turnstileToken);

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ message: "Preencha todos os campos obrigatorios." }, { status: 400 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Informe um e-mail valido." }, { status: 400 });
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ message: "A mensagem deve ter ate 4000 caracteres." }, { status: 400 });
    }

    if (!turnstileToken) {
      return NextResponse.json({ message: "Confirme a verificacao de seguranca." }, { status: 400 });
    }

    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    const resendApiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_FROM_EMAIL;
    const to = process.env.CONTACT_TO_EMAIL || "contato@institutoincentive.org.br";

    if (!turnstileSecret || !resendApiKey || !from) {
      return NextResponse.json({ message: "Formulario temporariamente indisponivel." }, { status: 500 });
    }

    const formData = new FormData();
    formData.append("secret", turnstileSecret);
    formData.append("response", turnstileToken);

    const remoteIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (remoteIp) {
      formData.append("remoteip", remoteIp);
    }

    const turnstileResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });
    const turnstileResult = (await turnstileResponse.json()) as TurnstileResult;

    if (!turnstileResult.success) {
      return NextResponse.json({ message: "Verificacao de seguranca nao concluida." }, { status: 403 });
    }

    const resendResponse = await fetch(RESEND_EMAILS_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject: `[Site] ${subject}`,
        text: [
          "Mensagem recebida pelo site institucional.",
          "",
          `Nome: ${name}`,
          `E-mail: ${email}`,
          `Assunto: ${subject}`,
          "",
          "Mensagem:",
          message,
        ].join("\n"),
      }),
    });

    if (!resendResponse.ok) {
      return NextResponse.json({ message: "Nao foi possivel enviar a mensagem agora." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Nao foi possivel processar a mensagem." }, { status: 400 });
  }
}
'@

$contactForm = @'
"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { MessageSquare, Send } from "lucide-react";

type FormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmitState = "idle" | "submitting" | "success" | "error";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const initialValues: FormValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const inputClasses =
  "mt-2 w-full rounded-2xl border border-sky-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10";

export function ContactForm() {
  const formId = useId();
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [values, setValues] = useState<FormValues>(initialValues);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<SubmitState>("idle");
  const [feedback, setFeedback] = useState("");

  const renderTurnstile = useCallback(() => {
    if (!turnstileSiteKey || !widgetContainerRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: turnstileSiteKey,
      callback: setTurnstileToken,
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken(""),
    });
  }, [turnstileSiteKey]);

  useEffect(() => {
    renderTurnstile();
  }, [renderTurnstile]);

  function updateValue(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function resetTurnstile() {
    setTurnstileToken("");
    if (window.turnstile && widgetIdRef.current) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!turnstileSiteKey) {
      setStatus("error");
      setFeedback("A verificacao antispam ainda precisa ser configurada para liberar o envio.");
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setFeedback("Confirme a verificacao de seguranca antes de enviar.");
      return;
    }

    setStatus("submitting");
    setFeedback("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, turnstileToken }),
      });

      const data = (await response.json().catch(() => ({}))) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Nao foi possivel enviar a mensagem agora.");
      }

      window.dataLayer?.push({
        event: "lead_form_submit",
        form_location: "contato",
        contact_subject: values.subject,
      });

      setValues(initialValues);
      setStatus("success");
      setFeedback("Mensagem enviada com sucesso. Retornaremos pelo e-mail informado.");
      resetTurnstile();
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Nao foi possivel enviar a mensagem agora.");
      resetTurnstile();
    }
  }

  const disabled = status === "submitting";

  return (
    <div className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 shadow-sm shadow-sky-900/5">
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      ) : null}

      <MessageSquare className="h-6 w-6 text-teal-700" aria-hidden="true" />
      <h2 className="mt-4 text-2xl font-extrabold text-slate-950">Mensagem rapida</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Compartilhe seu contato, o tema da conversa e uma breve descricao da demanda.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm font-bold text-slate-900" htmlFor={`${formId}-name`}>
          Nome
          <input
            id={`${formId}-name`}
            name="name"
            value={values.name}
            onChange={updateValue}
            className={inputClasses}
            required
            autoComplete="name"
            disabled={disabled}
          />
        </label>
        <label className="block text-sm font-bold text-slate-900" htmlFor={`${formId}-email`}>
          E-mail
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            value={values.email}
            onChange={updateValue}
            className={inputClasses}
            required
            autoComplete="email"
            disabled={disabled}
          />
        </label>
        <label className="block text-sm font-bold text-slate-900" htmlFor={`${formId}-subject`}>
          Assunto
          <input
            id={`${formId}-subject`}
            name="subject"
            value={values.subject}
            onChange={updateValue}
            className={inputClasses}
            required
            disabled={disabled}
          />
        </label>
        <label className="block text-sm font-bold text-slate-900" htmlFor={`${formId}-message`}>
          Mensagem
          <textarea
            id={`${formId}-message`}
            name="message"
            value={values.message}
            onChange={updateValue}
            className={`${inputClasses} min-h-32 resize-y`}
            maxLength={4000}
            required
            disabled={disabled}
          />
        </label>

        <div ref={widgetContainerRef} className="min-h-16" />

        {!turnstileSiteKey ? (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
            A verificacao antispam ainda precisa ser configurada para liberar o envio.
          </p>
        ) : null}

        {feedback ? (
          <p
            className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
              status === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-900"
                : "border border-rose-200 bg-rose-50 text-rose-900"
            }`}
            aria-live="polite"
          >
            {feedback}
          </p>
        ) : null}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-700 px-5 py-3 text-sm font-extrabold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled || !turnstileSiteKey}
        >
          {status === "submitting" ? "Enviando..." : "Enviar mensagem"}
          <Send className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
'@

New-Item -ItemType Directory -Force -Path "app\api\contact" | Out-Null
Set-Content -LiteralPath "app\api\contact\route.ts" -Value $routeTs -Encoding UTF8

New-Item -ItemType Directory -Force -Path "src\components" | Out-Null
Set-Content -LiteralPath "src\components\contact-form.tsx" -Value $contactForm -Encoding UTF8

$pagePath = "app\contato\page.tsx"
$page = Get-Content -LiteralPath $pagePath -Raw
$oldImport = 'import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";'
$newImport = 'import { Mail, MapPin, Phone } from "lucide-react";'
if (-not $page.Contains($oldImport)) {
  Write-Output "IMPORT_MARKER_NOT_FOUND"
  exit 3
}

$page = $page.Replace($oldImport, $newImport)
if (-not $page.Contains('import { ContactForm } from "@/components/contact-form";')) {
  if ($page.Contains($newImport + "`r`n")) {
    $page = $page.Replace($newImport + "`r`n", $newImport + "`r`n" + 'import { ContactForm } from "@/components/contact-form";' + "`r`n")
  } else {
    $page = $page.Replace($newImport + "`n", $newImport + "`n" + 'import { ContactForm } from "@/components/contact-form";' + "`n")
  }
}

$marker = '<div className="rounded-[2rem] border border-sky-100 bg-sky-50 p-6 shadow-sm shadow-sky-900/5">'
$start = $page.IndexOf($marker)
if ($start -lt 0) {
  Write-Output "FORM_MARKER_NOT_FOUND"
  exit 4
}

$formEnd = $page.IndexOf('</form>', $start)
if ($formEnd -lt 0) {
  Write-Output "FORM_END_NOT_FOUND"
  exit 5
}

$end = $page.IndexOf('</div>', $formEnd)
if ($end -lt 0) {
  Write-Output "CARD_END_NOT_FOUND"
  exit 6
}
$end += '</div>'.Length

$page = $page.Substring(0, $start) + '<ContactForm />' + $page.Substring($end)
Set-Content -LiteralPath $pagePath -Value $page -Encoding UTF8

$envPath = ".env.exemplo"
if (-not (Test-Path -LiteralPath $envPath)) {
  New-Item -ItemType File -Path $envPath | Out-Null
}
$envContent = Get-Content -LiteralPath $envPath -Raw
$envLines = @(
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY=",
  "TURNSTILE_SECRET_KEY=",
  "RESEND_API_KEY=",
  "CONTACT_FROM_EMAIL=",
  "CONTACT_TO_EMAIL=contato@institutoincentive.org.br"
)
foreach ($line in $envLines) {
  $key = $line.Split("=")[0]
  if ($envContent -notmatch "(?m)^$([regex]::Escape($key))=") {
    Add-Content -LiteralPath $envPath -Value $line -Encoding UTF8
    $envContent += "`n$line"
  }
}

npm run lint *> ".codex-lint.log"
if ($LASTEXITCODE -ne 0) {
  Write-Output "lint=fail"
  Get-Content ".codex-lint.log" -Tail 80
  exit $LASTEXITCODE
}
Write-Output "lint=ok"

npm run build *> ".codex-build.log"
if ($LASTEXITCODE -ne 0) {
  Write-Output "build=fail"
  Get-Content ".codex-build.log" -Tail 120
  exit $LASTEXITCODE
}
Write-Output "build=ok"

Remove-Item ".codex-lint.log", ".codex-build.log" -Force -ErrorAction SilentlyContinue

git add app/api/contact/route.ts src/components/contact-form.tsx app/contato/page.tsx .env.exemplo
git commit -m "feat: enviar formulario de contato pelo site"
git push -u origin $branch

$body = @"
Implementa envio real do formulario de contato do site com:
- rota segura em Next.js para enviar e-mail via Resend;
- validacao antispam via Cloudflare Turnstile;
- mensagens de sucesso/erro no proprio site;
- evento lead_form_submit no dataLayer para GTM/GA4.

Validacao local:
- npm run lint
- npm run build

Variaveis necessarias na Vercel antes de liberar em producao:
- NEXT_PUBLIC_TURNSTILE_SITE_KEY
- TURNSTILE_SECRET_KEY
- RESEND_API_KEY
- CONTACT_FROM_EMAIL
- CONTACT_TO_EMAIL
"@

$prUrl = gh pr create --repo instituto-incentive/instituto-incentive-site --base main --head $branch --title "feat: enviar formulario de contato pelo site" --body $body
Write-Output "BRANCH=$branch"
Write-Output "PR=$prUrl"
