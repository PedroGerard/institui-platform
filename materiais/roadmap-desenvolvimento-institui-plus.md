# Roadmap de Desenvolvimento - INSTITUI+

Atualizado em 14 de junho de 2026.

## Links operacionais

- Repositorio GitHub: https://github.com/PedroGerard/institui-platform
- GitHub Project: INSTITUI+ Roadmap de Desenvolvimento
- Figma: INSTITUI Design System e Modulos Operacionais
- Pull Request aberto: #9 - Sprint 00: contexto de associacao ativa

## Estado atual

O INSTITUI+ ja possui uma base funcional de ERP para OSCs com backend Fastify, Prisma, PostgreSQL, frontend Next.js e modulos operacionais em construcao.

Avancos recentes:

- Core Institucional consolidado com membros, mandatos e orgaos de governanca configuraveis.
- Suporte a orgaos alem de Diretoria Executiva e Conselho Fiscal, incluindo Conselho Consultivo e comites cientificos, tecnicos, de projetos, pesquisa, etica e outros.
- Frontend com contexto de associacao ativa, removendo dependencia de ID fixo nas telas operacionais.
- Compras MROSC com fluxo de edital, mapa de precos, selecao, homologacao e contrato.
- Prestacao de contas com projetos, documentos, checklist, parecer fiscal e relatorios.
- Tesouraria com pagamentos, conciliacao, relatorios e trilha de auditoria.
- Gerador de documentos oficiais com registros em banco.
- CI do monorepo preparado para validar Prisma, API, testes e frontend.

## Sprint 00 - Correcoes da auditoria

Objetivo: estabilizar a base tecnica antes de evoluir funcionalidades de mercado.

Status por frente:

- Issue #1 - Contexto de associacao ativa: implementada e em PR.
- Issue #2 - CI do monorepo: alteracao preparada localmente.
- Issue #3 - Ambiente, CORS e DATABASE_URL: pendente.
- Issue #4 - TODOs, mocks e defaults tecnicos: pendente.
- Issue #5 - Estrutura de paginas Next.js entre `app` e `src/app`: pendente.
- Issue #6 - Padronizacao visual administrativa: pendente.
- Issue #7 - Organizacao do Figma com frames rastreaveis: em andamento com esta atualizacao.
- Issue #8 - Documentacao operacional minima: em andamento com README e roadmap.

Criterio de fechamento da Sprint 00:

- PR #9 revisado e mergeado.
- CI rodando no GitHub Actions para API, Prisma, testes e frontend.
- Configuracao de ambiente documentada.
- Frontend sem associacao fixa em fluxo operacional critico.
- Roadmap, README e Figma alinhados.

## Sprint 01 - Fundacao Operacional

Meta: transformar a base atual em um piloto operacional navegavel para uma OSC.

Entregas:

- Fluxo inicial de selecao/configuracao da associacao ativa.
- Carga inicial da OSC piloto.
- Usuarios e permissoes iniciais.
- Revisao dos cadastros de membros, mandatos, orgaos e conselhos.
- Navegacao administrativa padronizada.
- Ajustes de acessibilidade em formularios, tabelas e botoes.
- Validacao ponta a ponta: membro -> mandato -> assembleia -> documento.

## Sprint 02 - Prestacao de Contas Piloto

Meta: permitir uma prestacao de contas completa com dados reais ou semi-reais.

Entregas:

- Criacao de projeto de prestacao.
- Upload e validacao de documentos obrigatorios.
- Checklist automatico de pendencias.
- Parecer do Conselho Fiscal.
- Geracao de relatorio PDF e XLS.
- Bloqueio de submissao com pendencias.
- AuditLog dos eventos principais.

## Sprint 03 - Compras e Contratacoes MROSC

Meta: consolidar o processo de selecao de fornecedores com rastreabilidade.

Entregas:

- Edital de cotacao previa.
- Mapa de precos.
- Ata de selecao de fornecedores.
- Homologacao.
- Contrato.
- Certidoes negativas e validade.
- Vinculo com pagamentos e prestacao de contas.

## Sprint 04 - Tesouraria, Contabilidade e Conselho Fiscal

Meta: fortalecer controles financeiros e decisao fiscal.

Entregas:

- Plano de contas ajustado para piloto.
- Lancamentos financeiros com documentos habeis.
- Pagamentos com bloqueios e aprovacoes.
- Conciliacao bancaria.
- Relatorios para Conselho Fiscal.
- Dashboard fiscal com pendencias e alertas.

## Sprint 05 - Documentos Oficiais e Templates

Meta: profissionalizar a geracao documental do INSTITUI+.

Entregas:

- Templates HTML/PDF para ata.
- Lista de presenca.
- Estatuto consolidado.
- Oficio/requerimento.
- Parecer fiscal.
- Registro de hash, origem e trilha de auditoria.

## Sprint 06 - Produto apto a piloto externo

Meta: preparar ambiente de homologacao e uso por usuarios reais.

Entregas:

- Ambientes DEV/HOMOLOGACAO.
- Variaveis de ambiente seguras.
- Backup.
- Deploy frontend e API.
- Banco gerenciado.
- Documentacao de operacao.
- Roteiro de testes com usuario.

## Indicadores de prontidao para mercado

O sistema estara apto a uma primeira oferta controlada quando cumprir:

- Fluxo institucional completo validado.
- Prestacao de contas completa validada.
- Compras MROSC rastreaveis.
- Tesouraria integrada a documentos e prestacao.
- Controle de acesso e segregacao minima de funcoes.
- CI ativo e builds confiaveis.
- Documentacao de implantacao e suporte.
- Identidade visual e experiencia administrativa consistentes.
