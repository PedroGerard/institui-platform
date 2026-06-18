# INSTITUI+

Plataforma integrada de gestao, governanca, compliance e prestacao de contas para Organizacoes da Sociedade Civil.

O INSTITUI+ nasce como um ERP especializado para OSCs brasileiras, reunindo core institucional, assembleias, tesouraria, compras e contratacoes MROSC, documentos oficiais, auditoria e prestacao de contas automatica.

## Status do desenvolvimento

Atualizado em 18 de junho de 2026.

- Repositorio GitHub atual: `PedroGerard/instituto-incentive-site`
- Figma: `INSTITUI Design System e Modulos Operacionais`
- GitHub Project: `INSTITUI+ Roadmap de Desenvolvimento`
- Sprint atual: `Sprint 01 - Fundacao Operacional do Sistema de Gestao`
- Estrutura atual: ERP em `instituto-platform` e site institucional em `instituto-incentive-site`

Avancos recentes:

- Frontend passou a usar contexto de associacao ativa, removendo ID fixo dos fluxos operacionais.
- `npm run dev` do frontend usa Webpack para evitar erro de symlink do Turbopack no Windows.
- CI do monorepo foi preparado para validar Prisma, gerar Prisma Client, testar/buildar API e buildar frontend.
- Roadmap de desenvolvimento documentado em `materiais/roadmap-desenvolvimento-institui-plus.md`.
- Figma organizado com frames rastreaveis para Sprint 00 e modulos operacionais.
- Documentacao operacional consolidada em `materiais/documentacao-operacional.md`.

## Modulos principais

- Core Institucional: associacao, membros, mandatos, usuarios, orgaos de governanca e conselhos configuraveis.
- Assembleias e governanca: convocacao, quorum, deliberacoes, atas, lista de presenca e trilha decisoria.
- Tesouraria e contabilidade: lancamentos, contas, pagamentos, conciliacao, relatorios e controles financeiros.
- Compras e contratacoes MROSC: cotacao previa, mapa de precos, selecao de fornecedores, homologacao e contratos.
- Prestacao de contas: projetos, documentos obrigatorios, checklist, parecer fiscal, relatorios e submissao.
- Gerador de documentos oficiais: atas, listas de presenca, estatuto consolidado, oficios e pareceres.
- Auditoria e compliance: logs, rastreabilidade, alertas e controles de conformidade.
- Frontend administrativo: portal operacional moderno em Next.js, com navegacao por modulos.
- Site institucional: presenca publica do Instituto Incentive, transparencia e paginas institucionais.

## Estrutura do repositorio

- `instituto-platform/apps/api`: API do ERP em Fastify, Prisma ORM, PostgreSQL, Clean Architecture e DDD.
- `instituto-platform/apps/frontend`: frontend administrativo do ERP em Next.js, React e Tailwind.
- `instituto-incentive-site`: site institucional publico do Instituto Incentive em Next.js.
- `materiais`: documentacao de apoio, roadmap, matrizes estatutarias e plano de implantacao.
- `materiais/divida-tecnica-sprint-00.md`: pendencias tecnicas rastreadas na Sprint 00.
- `materiais/figma-rastreabilidade-sprint-00.md`: convencao de frames e links Figma.
- `materiais/documentacao-operacional.md`: guia operacional para rodar, validar e contribuir.
- `.github/workflows`: validacoes automaticas no GitHub.

## Roadmap

O roadmap de desenvolvimento esta em:

```text
materiais/roadmap-desenvolvimento-institui-plus.md
```

Documentacao operacional:

```text
materiais/documentacao-operacional.md
materiais/figma-rastreabilidade-sprint-00.md
materiais/divida-tecnica-sprint-00.md
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

Crie os arquivos de ambiente a partir dos exemplos:

```bash
cp .env.example .env
cp instituto-platform/apps/api/.env.example instituto-platform/apps/api/.env
cp instituto-platform/apps/frontend/.env.example instituto-platform/apps/frontend/.env.local
```

Em producao, `DATABASE_URL` e `CORS_ORIGINS` devem ser definidas obrigatoriamente no ambiente. O fallback local de banco e origens CORS so e usado fora de producao.
O site institucional, por enquanto, nao exige arquivo `.env`.

Rode o frontend administrativo do ERP:

```bash
npm run dev:frontend
```

O script do frontend usa Webpack para evitar falhas do Turbopack com symlinks em ambiente Windows/monorepo.

Rode a API:

```bash
npm run dev:api
```

Rode o site institucional:

```bash
npm ci --prefix instituto-incentive-site
npm run dev:site
```

ERP frontend:

```text
http://localhost:3000
```

API:

```text
http://localhost:3333
```

Site institucional:

```text
http://localhost:3000
```

## Validacao

Validacao completa do monorepo:

```bash
npm run ci
```

Esse comando valida Prisma, gera o Prisma Client, executa os testes da API e faz build da API e do frontend. E o mesmo fluxo usado no GitHub Actions.

Validar o schema do Prisma:

```bash
npx prisma validate --schema instituto-platform/apps/api/prisma/schema.prisma
```

Gerar o Prisma Client:

```bash
npx prisma generate --schema instituto-platform/apps/api/prisma/schema.prisma
```

Executar testes da API:

```bash
npm run test --workspace=instituto-platform/apps/api -- --run
```

Build da API:

```bash
npm run build:api
```

Build do frontend:

```bash
npm run build:frontend
```

## Variaveis de ambiente principais

- `DATABASE_URL`: conexao PostgreSQL usada pelo Prisma.
- `PORT`: porta da API. Padrao local: `3333`.
- `HOST`: host da API. Padrao local: `0.0.0.0`.
- `CORS_ORIGINS`: origens permitidas pela API, separadas por virgula.
- `CORS_METHODS`: metodos HTTP permitidos pela API. Padrao local: `GET,POST,PATCH,DELETE,OPTIONS`.
- `CORS_HEADERS`: cabecalhos permitidos pela API. Padrao local: `Content-Type,Authorization,x-association-id,x-user-id`.
- `NEXT_PUBLIC_API_URL`: URL publica da API consumida pelo frontend.
- `NEXT_PUBLIC_ACTIVE_ASSOCIATION_ID`: associacao inicial opcional para desenvolvimento.

Em producao, `CORS_ORIGINS` nao aceita `*`; informe explicitamente as URLs do frontend e dos paineis autorizados.

## Publicacao

Repositorio principal:

```text
https://github.com/PedroGerard/instituto-incentive-site
```

Configuracao recomendada para publicacao do frontend na Vercel:

- Root Directory do ERP: `instituto-platform/apps/frontend`
- Root Directory do site institucional: `instituto-incentive-site`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: padrao do Next.js

## Transparencia e documentos

O projeto tambem inclui materiais e documentos publicos do Instituto Incentive usados como base para transparencia institucional, matriz estatutaria, prestacao de contas e exemplos de governanca.

Novos documentos devem passar por validacao institucional antes de publicacao, com atencao a dados pessoais, informacoes sensiveis e requisitos da LGPD.
