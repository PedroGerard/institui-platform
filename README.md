# INSTITUI+

Plataforma integrada de gestao, governanca, compliance e prestacao de contas para Organizacoes da Sociedade Civil.

O INSTITUI+ nasce como um ERP especializado para OSCs brasileiras, reunindo core institucional, assembleias, tesouraria, compras e contratacoes MROSC, documentos oficiais, auditoria e prestacao de contas automatica.

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
npm run prisma:validate --workspace=apps/api
```

Executar testes da API:

```bash
npm test --workspace=apps/api
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

