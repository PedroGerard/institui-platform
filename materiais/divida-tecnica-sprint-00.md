# Divida tecnica - Sprint 00

Atualizado em 16 de junho de 2026.

Este registro separa pontos encontrados na auditoria que nao devem ser resolvidos por troca pontual de texto, pois exigem refatoracao com teste dedicado.

## Pontos tratados nesta etapa

- Tipagem de eventos de dominio em `AggregateRoot`.
- Remocao de `any` evitavel em `DomainEventMapper`, `Entity` e `LegalEventController`.
- Limpeza de comentarios temporarios em servicos e controllers.
- Remocao de imports mortos no gerador de PDF.
- Conversao do `confirm = true` em `RegisterRevenue` para regra real de negocio.
- Correcoes de mensagens quebradas por codificacao nos use cases de Tesouraria tocados.
- Testes unitarios para a regra de receita com conta `REVENUE`.

## Pendencias tecnicas rastreadas

- Criar mappers dedicados Prisma -> dominio para Assembleias, Estatutos, Membros, Prestacao de Contas e Eleicoes.
- Remover casts `as any` restantes em reposititorios Prisma apos a criacao desses mappers.
- Tipar transacoes Prisma usadas em `PrismaAssemblyRepository` e `PrismaStatuteRepository`.
- Revisar o fluxo de Estatuto ativo, hoje dependente do relacionamento com Associacao.
- Padronizar o payload de `LegalEvent` para um contrato JSON tipado por evento.
- Criar testes unitarios especificos para use cases de Tesouraria alem de receita.
