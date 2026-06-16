# Figma - Rastreabilidade Sprint 00

Atualizado em 16 de junho de 2026.

Arquivo Figma:

```text
INSTITUI Design System e Modulos Operacionais
https://www.figma.com/design/nwdlcF7KGW0guVk2SKTIBi/INSTITUI--Design-System-e-Modulos-Operacionais
```

## Objetivo

Manter uma ponte clara entre Figma, GitHub Project, PRs e implementacao do frontend.

Cada frame relevante deve ter nome rastreavel, indicando produto, sprint, modulo, issue ou rota. Isso evita que o design vire um arquivo solto e permite que a Sprint 01 use o Figma como referencia operacional.

## Paginas e frames criados

| Pagina | Frame principal | Node ID | Finalidade |
|---|---|---:|---|
| Roadmap de Desenvolvimento | INSTITUI+ / Sprint 00 / Roadmap Rastreavel | 17:2 | Mapa visual das issues #1 a #8 da Sprint 00 |
| INSTITUI+ UI Kit e Modulos | INSTITUI+ / Modulos / Mapa operacional rastreavel | 21:2 | Mapa dos modulos e rotas operacionais para Sprint 01 |

Frames existentes mantidos:

| Pagina | Frame | Node ID |
|---|---|---:|
| INSTITUI+ UI Kit e Modulos | Design System - INSTITUI+ | 1:3 |
| INSTITUI+ UI Kit e Modulos | Dashboard operacional - desktop | 1:36 |
| Roadmap de Desenvolvimento | INSTITUI+ Roadmap - Atualizacao 2026-06-14 | 10:3 |

## Convencao de nomes

Use sempre este padrao:

```text
INSTITUI+ / Sprint NN / #ISSUE / Nome da entrega
INSTITUI+ / Modulos / Nome do modulo
```

Exemplos:

```text
INSTITUI+ / Sprint 00 / #7 / Figma rastreavel
INSTITUI+ / Modulos / Core Institucional
INSTITUI+ / Modulos / Prestacao de Contas
```

## Modulos rastreados

- Dashboard Administrativo: `/dashboard`
- Core Institucional: `/membros`, `/mandatos`, `/orgaos`
- Governanca e Assembleias: `/assembleias`
- Tesouraria: `/tesouraria`
- Compras MROSC: `/compras`
- Prestacao de Contas: `/prestacao-contas`
- Documentos Oficiais: `/documentos`
- Transparencia: `/transparencia`
- Documentacao Operacional: `README.md` e `materiais/`

## Como usar na Sprint 01

1. Abrir o frame do modulo no Figma.
2. Conferir a rota indicada no frame.
3. Implementar ou ajustar a tela correspondente no frontend.
4. Referenciar o frame na issue ou PR do GitHub.
5. Validar visualmente antes do merge.

## Criterio de aceite da Issue #7

- Figma possui pagina de roadmap rastreavel.
- Figma possui frames por modulo operacional.
- Frames possuem nomes consistentes e reaproveitaveis em issues/PRs.
- Este documento registra paginas, frames, IDs e convencao de uso.
