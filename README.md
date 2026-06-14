# INSTITUI+

Plataforma integrada de gestao, governanca, compliance e prestacao de contas para Organizacoes da Sociedade Civil.

O INSTITUI+ nasce como um ERP especializado para OSCs brasileiras, reunindo core institucional, assembleias, tesouraria, compras e contratacoes MROSC, documentos oficiais, auditoria e prestacao de contas automatica.

## Status do desenvolvimento

Atualizado em 14 de junho de 2026.

- Repositorio GitHub: `PedroGerard/institui-platform`
- Figma: `INSTITUI Design System e Modulos Operacionais`
- GitHub Project: `INSTITUI+ Roadmap de Desenvolvimento`
- Sprint atual: `Sprint 00 - Correcoes da auditoria`
- PR em andamento: `#9 - Sprint 00: contexto de associacao ativa`

Avancos recentes:

- Frontend passou a usar contexto de associacao ativa, removendo ID fixo dos fluxos operacionais.
- `npm run dev` do frontend usa Webpack para evitar erro de symlink do Turbopack no Windows.
- CI do monorepo foi preparado para validar Prisma, gerar Prisma Client, testar/buildar API e buildar frontend.
- Roadmap de desenvolvimento documentado em `materiais/roadmap-desenvolvimento-institui-plus.md`.

## Modulos principais

- Core Institucional: associacao, membros, mandatos, usuarios, orgaos de governanca e conselhos configuraveis.
- Assembleias e governanca: convocacao, quorum, deliberacoes, atas, lista de presenca e trilha decisoria.
- Tesouraria e contabilidade: lancamentos, contas, pagamentos, conciliacao, relatorios e controles financeiros.
- Compras e contratacoes MROSC: cotacao previa, mapa de precos, selecao de fornecedores, homologacao e contratos.
- Prestacao de contas: projetos, documentos obrigatorios, checklist, parecer fiscal, relatorios e submissao.
- Gerador de documentos oficiais: atas, listas de presenca, estatuto consolidado, oficios e pareceres.
- Auditoria e compliance: logs, rastreabilidade, alertas e controles de conformidade.
- Frontend institucional: portal administrativo moderno em Next.js, com navegacao por modulos.

## Estrutura do repositorio

- `apps/api`: API em Fastify, Prisma ORM, PostgreSQL, Clean Architecture e DDD.
- `apps/frontend`: frontend em Next.js, React e Tailwind.
- `materiais`: documentacao de apoio, roadmap, matrizes estatutarias e plano de implantacao.
- `.github/workflows`: validacoes automaticas no GitHub.

## Roadmap

O roadmap de desenvolvimento esta em:

```text
materiais/roadmap-desenvolvimento-institui-plus.md
```

Resumo das proximas frentes:

- Sprint 00: estabilizacao tecnica, CI, ambiente, documentacao e alinhamento Figma/GitHub.
- Sprint 01: fundacao operacional e dados da OSC piloto.
- Sprint 02: prestacao de contas piloto.
- Sprint 03: compras e contratacoes MROSC.
- Sprint 04: tesouraria, contabilidade e Conselho Fiscal.
- Sprint 05: documentos oficiais e templates.
- Sprint 06: ambiente de homologacao e piloto externo.

## Tecnologias

### Backend

- Fastify
- Prisma ORM
- PostgreSQL
- TypeScript
- Clean Architecture
- DDD

### Frontend

- Next.js
- React
- Tailwind CSS
- TypeScript

### Infraestrutura

- Docker
- GitHub Actions
- Deploy cloud planejado

## Como rodar localmente

Instale as dependencias na raiz:

```bash
npm install
```

Rode o frontend:

```bash
npm run dev --workspace=apps/frontend
```

O script do frontend usa Webpack para evitar falhas do Turbopack com symlinks em ambiente Windows/monorepo.

Rode a API:

```bash
npm run dev --workspace=apps/api
```

Frontend:

```text
http://localhost:3000
```

API:

```text
http://localhost:3333
```

## Validacao

Validar o schema do Prisma:

```bash
npx prisma validate --schema apps/api/prisma/schema.prisma
```

Gerar o Prisma Client:

```bash
npx prisma generate --schema apps/api/prisma/schema.prisma
```

Executar testes da API:

```bash
npm run test --workspace=apps/api -- --run
```

Build da API:

```bash
npm run build --workspace=apps/api
```

Build do frontend:

```bash
npm run build --workspace=apps/frontend
```

## Publicacao

Repositorio principal:

```text
https://github.com/PedroGerard/institui-platform
```

Configuracao recomendada para publicacao do frontend na Vercel:

- Root Directory: `apps/frontend`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: padrao do Next.js

## Transparencia e documentos

O projeto tambem inclui materiais e documentos publicos do Instituto Incentive usados como base para transparencia institucional, matriz estatutaria, prestacao de contas e exemplos de governanca.

Novos documentos devem passar por validacao institucional antes de publicacao, com atencao a dados pessoais, informacoes sensiveis e requisitos da LGPD.
