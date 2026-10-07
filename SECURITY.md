# Seguranca

Este repositorio contem apenas o site institucional publico do Instituto Incentive. Ele roda em Next.js na Vercel e nao possui banco de dados, area administrativa publica, login proprio ou API interna.

## Contato

Falhas de seguranca devem ser comunicadas pelo e-mail:

```text
contato@institutoincentive.org.br
```

Inclua, sempre que possivel:

- URL afetada;
- descricao objetiva do problema;
- passos de reproducao;
- impacto potencial;
- evidencias sem expor dados pessoais ou documentos nao publicos.

## Escopo

Estao no escopo:

- paginas publicas do site;
- documentos servidos em `public/`;
- configuracao de headers e deploy;
- dependencias npm do site;
- scripts de validacao do site.

Nao estao no escopo deste repositorio:

- ERP INSTITUI+;
- banco de dados;
- contas pessoais;
- paineis administrativos externos;
- sistemas de terceiros como Vercel, GitHub, Google, Registro.br ou Cloudflare.

## Controles tecnicos atuais

- HTTPS gerenciado pela Vercel.
- Redirecionamento do dominio raiz para `www.institutoincentive.org.br`.
- Headers basicos de seguranca no Next.js: HSTS, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` e CSP basica.
- Sem formularios com persistencia em servidor; o contato usa `mailto:`.
- Sem credenciais no codigo-fonte.
- Dependabot para npm e GitHub Actions.
- Validacao por `npm run lint` e `npm run build`.

## Controles operacionais recomendados

- Ativar 2FA em GitHub, Vercel, DNS/Registro.br e contas Google.
- Usar permissoes minimas para colaboradores.
- Evitar push direto em `main`; usar branch, PR e validacao automatica.
- Revisar alertas do Dependabot e atualizar Next.js/React rapidamente.
- Considerar Cloudflare ou Vercel Firewall/WAF para protecao de borda.
- Manter copia externa dos documentos publicos e materiais editoriais.
- Monitorar disponibilidade do dominio oficial.

## Fora de uso neste site

Como o site nao possui login, banco de dados ou painel administrativo publico, os riscos de brute force, SQL injection e vazamento por credenciais de usuarios finais nao se aplicam diretamente ao site atual. Se essas funcionalidades forem adicionadas no futuro, sera necessario incluir validacao server-side, rate limiting, protecao CSRF quando aplicavel, logs, monitoramento e controle de acesso por menor privilegio.
