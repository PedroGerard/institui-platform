# Documentacao operacional - INSTITUI+

Atualizado em 18 de junho de 2026.

Este documento orienta como rodar, validar, contribuir e preparar o INSTITUI+ a partir da separacao entre ERP e site institucional.

## Repositorio e ferramentas

- Repositorio atual: `PedroGerard/instituto-incentive-site`
- Branch de trabalho atual: `main`
- GitHub Project: `INSTITUI+ Roadmap de Desenvolvimento`
- Figma: `INSTITUI Design System e Modulos Operacionais`
- Workflow principal de validacao: `.github/workflows/frontend.yml`

## Preparacao local

Instalar dependencias na raiz:

```bash
npm install
```

Criar arquivos de ambiente:

```bash
cp .env.example .env
cp instituto-platform/apps/api/.env.example instituto-platform/apps/api/.env
cp instituto-platform/apps/frontend/.env.example instituto-platform/apps/frontend/.env.local
```

O site institucional em `instituto-incentive-site` nao exige arquivo `.env` neste momento.

Variaveis obrigatorias em producao:

- `DATABASE_URL`
- `CORS_ORIGINS`

Em producao, `CORS_ORIGINS` deve listar origens explicitas e nao pode usar `*`.

## Rodar localmente

Frontend administrativo do ERP:

```bash
npm run dev:frontend
```

API:

```bash
npm run dev:api
```

Site institucional:

```bash
npm ci --prefix instituto-incentive-site
npm run dev:site
```

URLs padrao:

```text
ERP frontend: http://localhost:3000
API: http://localhost:3333
Site institucional: http://localhost:3000
```

## Validacao obrigatoria

Antes de abrir ou atualizar PR:

```bash
npm run ci
```

Esse comando executa:

- validacao do Prisma;
- geracao do Prisma Client;
- testes da API;
- build da API;
- build do frontend administrativo;
- build do site institucional.

Comandos individuais:

```bash
npm run prisma:validate
npm run prisma:generate
npm run test:api
npm run build:api
npm run build:frontend
npm run build:site
```

## Fluxo GitHub

1. Criar ou continuar uma branch `codex/...`.
2. Fazer commits pequenos por issue ou frente funcional.
3. Atualizar README, roadmap ou materiais quando a entrega alterar processo.
4. Rodar `npm run ci`.
5. Abrir ou atualizar PR para `main`.
6. Vincular PR e issues ao GitHub Project.
7. Aguardar GitHub Actions passar.
8. Fazer merge somente com Sprint 00 coerente e validada.

## Fluxo Figma

Arquivo:

```text
https://www.figma.com/design/nwdlcF7KGW0guVk2SKTIBi/INSTITUI--Design-System-e-Modulos-Operacionais
```

Documentacao de rastreabilidade:

```text
materiais/figma-rastreabilidade-sprint-00.md
```

Uso recomendado:

- Cada modulo deve ter frame rastreavel.
- Cada frame deve indicar rota, sprint e escopo.
- Issues e PRs devem citar o frame quando houver alteracao visual.
- Antes de implementar uma tela operacional, conferir o frame correspondente.

## Checklist de fechamento da Sprint 00

- Issue #1: contexto de associacao ativa revisado no PR.
- Issue #2: CI do monorepo validado.
- Issue #3: ambiente, CORS e `DATABASE_URL` validados.
- Issue #4: divida tecnica revisada e documentada.
- Issue #5: rotas Next.js unificadas.
- Issue #6: visual administrativo inicial padronizado.
- Issue #7: Figma organizado com frames rastreaveis.
- Issue #8: documentacao operacional minima criada.
- GitHub Actions passando.
- PR #9 atualizado e pronto para merge.

## Entrada da Sprint 01

A Sprint 01 pode comecar quando:

- `main` estiver atualizada com a Sprint 00;
- CI estiver verde no GitHub;
- Figma tiver frames rastreaveis dos modulos principais;
- README e materiais operacionais estiverem atualizados;
- houver definicao da associacao piloto e dados iniciais.

Primeira entrega recomendada da Sprint 01:

```text
Fluxo operacional: associacao ativa -> membros -> mandatos -> assembleia -> ata/documento.
```
