# Publicacao na Vercel

Guia rapido para publicar o novo site do Instituto Incentive usando o repositorio GitHub.

## Repositorio

```text
https://github.com/PedroGerard/institui-platform
```

## Configuracao do projeto na Vercel

Ao importar o repositorio, usar:

- Framework Preset: `Next.js`
- Root Directory: vazio / raiz do repositorio
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: deixar em branco ou manter o padrao do Next.js

O site publico esta na raiz do repositorio, com `app/`, `src/`, `public/`, `package.json`,
`next.config.ts` e `vercel.json`.

Nao apontar o deploy publico para `instituto-incentive-site`, `apps/frontend` nem
`instituto-platform/apps/frontend`. Esses caminhos pertencem a estruturas antigas ou ao sistema de gestao.

## Correcao urgente: erro de Root Directory

Se a Vercel mostrar a mensagem:

```text
O diretorio raiz especificado "apps/frontend" nao existe.
```

o projeto esta apontando para o caminho antigo. Corrija no painel da Vercel:

1. Acesse o projeto do site institucional.
2. Entre em `Settings`.
3. Abra `Build & Development Settings`.
4. Em `Root Directory`, clique em `Edit`.
5. Remova qualquer caminho preenchido e deixe o campo vazio, apontando para a raiz.
6. Salve.
7. Volte em `Deployments` e clique em `Redeploy` no ultimo deploy.

Nao use `instituto-incentive-site`, `apps/frontend` nem `instituto-platform/apps/frontend` para o site publico.
Esses caminhos pertencem ao historico da transicao ou ao sistema administrativo.

## Passo a passo

1. Acessar https://vercel.com.
2. Entrar com a conta GitHub `PedroGerard`.
3. Clicar em `Add New` e depois `Project`.
4. Importar o repositorio `institui-platform`.
5. Em `Root Directory`, manter vazio para usar a raiz do repositorio.
6. Conferir se o framework foi detectado como `Next.js`.
7. Conferir os comandos:

```text
Install Command: npm ci
Build Command: npm run build
```

8. Clicar em `Deploy`.

Se a Vercel preencher automaticamente `npm install --prefix=../..`, editar o campo e trocar por `npm ci`.

## Depois do primeiro deploy

Verificar:

- Home carrega corretamente.
- Paginas `/quem-somos`, `/projetos`, `/transparencia`, `/transparencia/emendas-parlamentares`, `/certificacoes-reconhecimentos` e `/contato` abrem.
- Imagens dos projetos aparecem.
- Links externos do Mapa Cultural abrem em nova aba.
- Area `/dashboard` nao deve existir no deploy do site; ela pertence ao ERP em `instituto-platform/apps/frontend`.
- Cabecalhos de seguranca aparecem nas respostas: HSTS, `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` e CSP basica.

## Dominio

Dominio informado:

```text
institutoincentive.org.br
```

Depois que o deploy estiver aprovado, adicionar o dominio na Vercel e ajustar o DNS no provedor onde o dominio esta registrado.

## Pendencias antes de divulgar publicamente

- Confirmar e-mail oficial de contato.
- Confirmar endereco publico oficial.
- Publicar ou preparar documentos oficiais da aba Transparencia.
- Configurar deploy separado para o ERP administrativo quando a autenticacao estiver pronta.
- Configurar Google Search Console, GA4 ou GTM e variaveis de ambiente na Vercel.
