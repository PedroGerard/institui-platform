# INSTITUI+ Platform

Sistema de gestao, governanca, compliance, tesouraria, compras MROSC, documentos oficiais e prestacao de contas para OSCs.

## Estrutura

- `apps/api`: backend Fastify, Prisma e PostgreSQL.
- `apps/frontend`: frontend administrativo do ERP.
- `packages`: pacotes compartilhados futuros.

## Comandos principais

Executar a partir da raiz do repositorio:

```bash
npm run dev:api
npm run dev:frontend
npm run prisma:validate
npm run seed:pilot
npm run test:api
npm run build:platform
```

## Carga piloto

Para iniciar um ambiente com a fundacao operacional do Instituto Incentive, rode:

```bash
npm run seed:pilot
```

A carga e idempotente e cria/atualiza:

- associacao piloto do Instituto Incentive;
- usuarios operacionais iniciais;
- membros, orgaos configuraveis, conselhos e mandatos;
- assembleia piloto com presenca e deliberacoes;
- estatuto consolidado piloto;
- plano de contas, fundos e prestacao de contas inicial.

## Foco atual

Sprint 01: Fundacao Operacional do Sistema de Gestao.
