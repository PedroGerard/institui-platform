$ErrorActionPreference = "Stop"

$repo = "C:\Users\user\Documents\instituto-incentive-site"
$branchBase = "codex/formulario-contato-real-20260717"
Set-Location -LiteralPath $repo

git switch main | Out-Null
git pull --ff-only origin main | Out-Null

$branch = $branchBase
if (git show-ref --verify --quiet "refs/heads/$branch") {
  $branch = "$branchBase-v2"
}
git switch -c $branch | Out-Null

New-Item -ItemType Directory -Force -Path "app\api\contact" | Out-Null
New-Item -ItemType Directory -Force -Path "src\components" | Out-Null

$route = @'
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactPayload = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
  turnstileToken?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function clean(value: unknown, max = 500) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

async function verifyTurnstile(token: string, ip?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("TURNSTILE_NOT_CONFIGURED");
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) {
    body.set("remoteip", ip);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body,
  });

  if (!response.ok) {
    return false;
  }

  const data = (await response.json()) as { success?: boolean };
  return Boolean(data.success);
}

async function sendContactEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL ?? "contato@institutoincentive.org.br";

  if (!apiKey || !from) {
    throw new Error("EMAIL_NOT_CONFIGURED");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[Site Instituto Incentive] ${subject}`,
      text: [
        "Nova mensagem recebida pelo site institucional.",
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

  if (!response.ok) {
    throw new Error("EMAIL_SEND_FAILED");
  }
}

export async function POST(request: Request) {
  let payload: ContactPayload;

  try {
    payload = await request.json();
  } catch {
    return jsonError("Dados invalidos.");
  }

  const name = clean(payload.name, 120);
  const email = clean(payload.email, 160);
  const subject = clean(payload.subject, 160);
  const message = clean(payload.message, 3000);
  const turnstileToken = clean(payload.turnstileToken, 2048);

  if (!name || !email || !subject || !message) {
    return jsonError("Preencha todos os campos.");
  }

  if (!emailPattern.test(email)) {
    return jsonError("Informe um e-mail valido.");
  }

  if (message.length < 10) {
    return jsonError("A mensagem precisa ter pelo menos 10 caracteres.");
  }

  if (!turnstileToken) {
    return jsonError("Confirme a verificacao antispam.");
  }

  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();

  try {
    const verified = await verifyTurnstile(turnstileToken, ip);
    if (!verified) {
      return jsonError("Nao foi possivel validar a verificacao antispam.", 403);
    }

    await sendContactEmail({ name, email, subject, message });

    return NextResponse.json({
      ok: true,
      message: "Mensagem enviada com sucesso.",
    });
  } catch (error) {
    const code = error instanceof Error ? error.message : "CONTACT_ERROR";

    if (code === "TURNSTILE_NOT_CONFIGURED" || code === "EMAIL_NOT_CONFIGURED") {
      return jsonError("Servico de contato ainda nao configurado.", 503);
    }

    return jsonError("Nao foi possivel enviar a mensagem agora.", 500);
  }
}
'@
Set-Content -LiteralPath "app\api\contact\route.ts" -Value $route -Encoding UTF8

$component = @'
"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Send } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
          theme?: "light" | "dark" | "auto";
        },
      ) => string;
      reset: (widgetId?: string) => void;
    };
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type Status = "idle" | "sending" | "success" | "error";

export function ContactForm() {
  const turnstileRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (!siteKey || !turnstileReady || !turnstileRef.current || !window.turnstile || widgetIdRef.current) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: siteKey,
      theme: "light",
      callback: setToken,
      "expired-callback": () => setToken(""),
      "error-callback": () => setToken(""),
    });
  }, [turnstileReady]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!token) {
      setStatus("error");
      setFeedback("Confirme a verificacao antispam antes de enviar.");
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);

    setStatus("sending");
    setFeedback("");

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: data.get("name"),
        email: data.get("email"),
        subject: data.get("subject"),
        message: data.get("message"),
        turnstileToken: token,
      }),
    });

    const result = (await response.json().catch(() => null)) as
      | { ok?: boolean; message?: string }
      | null;

    if (!response.ok || !result?.ok) {
      setStatus("error");
      setFeedback(result?.message ?? "Nao foi possivel enviar a mensagem agora.");
      window.turnstile?.reset(widgetIdRef.current);
      setToken("");
      return;
    }

    window.dataLayer?.push({
      event: "lead_form_submit",
      form_name: "contact",
      form_location: "contato",
    });

    setStatus("success");
    setFeedback(result.message ?? "Mensagem enviada com sucesso.");
    form.reset();
    window.turnstile?.reset(widgetIdRef.current);
    setToken("");
  }

  return (
    <>
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => setTurnstileReady(true)}
        />
      ) : null}

      <form
        className="rounded-[8px] border border-teal-100 bg-teal-50 p-6 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="mb-6">
          <span className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-[8px] border border-teal-200 text-teal-800">
            <Send aria-hidden="true" size={20} />
          </span>
          <h2 className="text-2xl font-bold text-teal-950">Mensagem rapida</h2>
          <p className="mt-2 text-sm leading-6 text-teal-900/80">
            Compartilhe seu contato, o tema da conversa e uma breve descricao da demanda.
          </p>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2 text-sm font-semibold text-teal-950">
            Nome
            <input
              required
              name="name"
              type="text"
              autoComplete="name"
              className="min-h-11 rounded-[6px] border border-teal-200 bg-white px-3 text-base text-teal-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-teal-950">
            E-mail
            <input
              required
              name="email"
              type="email"
              autoComplete="email"
              className="min-h-11 rounded-[6px] border border-teal-200 bg-white px-3 text-base text-teal-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-teal-950">
            Assunto
            <input
              required
              name="subject"
              type="text"
              className="min-h-11 rounded-[6px] border border-teal-200 bg-white px-3 text-base text-teal-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-teal-950">
            Mensagem
            <textarea
              required
              name="message"
              rows={5}
              minLength={10}
              className="rounded-[6px] border border-teal-200 bg-white px-3 py-3 text-base text-teal-950 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/20"
            />
          </label>

          {siteKey ? (
            <div className="min-h-[65px]" ref={turnstileRef} />
          ) : (
            <p className="rounded-[6px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Verificacao antispam pendente de configuracao.
            </p>
          )}

          {feedback ? (
            <p
              className={`rounded-[6px] px-3 py-2 text-sm font-semibold ${
                status === "success"
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-red-50 text-red-900"
              }`}
              role="status"
            >
              {feedback}
            </p>
          ) : null}

          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-[6px] bg-teal-700 px-5 text-sm font-bold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={status === "sending" || !siteKey}
            type="submit"
          >
            {status === "sending" ? "Enviando..." : "Enviar mensagem"}
            <Send aria-hidden="true" size={16} />
          </button>
        </div>
      </form>
    </>
  );
}
'@
Set-Content -LiteralPath "src\components\contact-form.tsx" -Value $component -Encoding UTF8

$pagePath = "app\contato\page.tsx"
$page = Get-Content -Raw -LiteralPath $pagePath
if ($page -notmatch 'from "@/components/contact-form"') {
  $page = [regex]::Replace(
    $page,
    '\A((?:import[^\r\n]+(?:\r?\n))+)',
    "`$1import { ContactForm } from `"@/components/contact-form`";`r`n",
    1
  )
}

$page = [regex]::Replace(
  $page,
  'import\s+\{([^}]+)\}\s+from\s+"lucide-react";',
  {
    param($match)
    $items = $match.Groups[1].Value -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -and $_ -ne "Send" }
    'import { ' + ($items -join ", ") + ' } from "lucide-react";'
  },
  1
)

$formMatches = [regex]::Matches($page, '(?s)<form\b.*?</form>')
if ($formMatches.Count -ne 1) {
  throw "Expected exactly one form in contact page, found $($formMatches.Count)."
}
$page = [regex]::Replace($page, '(?s)<form\b.*?</form>', '<ContactForm />', 1)
Set-Content -LiteralPath $pagePath -Value $page -Encoding UTF8

$envFiles = @(".env.example", ".env.exemplo") | Where-Object { Test-Path -LiteralPath $_ }
if ($envFiles.Count -eq 0) {
  $envFiles = @(".env.exemplo")
  New-Item -ItemType File -Force -Path ".env.exemplo" | Out-Null
}

$envLines = @(
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY=",
  "TURNSTILE_SECRET_KEY=",
  "RESEND_API_KEY=",
  "CONTACT_FROM_EMAIL=",
  "CONTACT_TO_EMAIL=contato@institutoincentive.org.br"
)

foreach ($envFile in $envFiles) {
  $content = Get-Content -Raw -LiteralPath $envFile
  foreach ($line in $envLines) {
    $key = $line.Split("=")[0]
    if ($content -notmatch "(?m)^$([regex]::Escape($key))=") {
      if ($content.Length -gt 0 -and -not $content.EndsWith("`n")) {
        $content += "`r`n"
      }
      $content += "$line`r`n"
    }
  }
  Set-Content -LiteralPath $envFile -Value $content -Encoding UTF8
}

$configPath = "next.config.ts"
if (Test-Path -LiteralPath $configPath) {
  $config = Get-Content -Raw -LiteralPath $configPath
  if ($config -match "Content-Security-Policy" -and $config -notmatch "challenges.cloudflare.com") {
    foreach ($directive in @("script-src", "frame-src", "connect-src")) {
      $config = [regex]::Replace(
        $config,
        "($directive[^;`"']*)",
        {
          param($match)
          if ($match.Value -match "challenges.cloudflare.com") {
            $match.Value
          } else {
            $match.Value + " https://challenges.cloudflare.com"
          }
        },
        1
      )
    }
    Set-Content -LiteralPath $configPath -Value $config -Encoding UTF8
  }
}

git status --short
Write-Output "BRANCH=$branch"
