# Construcao modulo a modulo - INSTITUI+

Atualizado em 09 de junho de 2026.

## Criterio padrao de fechamento de modulo

Um modulo so deve ser considerado fechado quando cumprir estes pontos:

- Schema Prisma validado.
- Regras de negocio principais cobertas por caso de uso.
- Endpoints REST funcionais.
- Telas principais navegaveis.
- Testes automatizados relevantes passando.
- Build completo sem erro.
- Fluxo minimo validado com dados reais ou semi-reais.

## Modulo 1 - Core Institucional

Objetivo: estruturar a base juridica e institucional da OSC.

Escopo:

- Associacao.
- Membros.
- Tipos e status de membros.
- Mandatos.
- Cargos de governanca.
- Orgaos de governanca configuraveis.
- Conselho Fiscal como base para prestacao de contas.
- Usuarios vinculados a associacao.

Status atual:

- Schema de `Member`, `Mandate`, `MemberType`, `MemberStatus` e `GovernanceRole` validado.
- CPF unico por associacao implementado no banco.
- Cadastro, listagem, detalhe e alteracao de status de membros disponiveis.
- Criacao, listagem, listagem de ativos e encerramento de mandatos disponiveis.
- Mandato para membro inativo bloqueado.
- Dois mandatos ativos para o mesmo cargo na mesma associacao bloqueados.
- Mandatos ativos sobrepostos para o mesmo membro bloqueados no caso de uso.
- Telas `/membros`, `/membros/novo`, `/membros/[id]`, `/mandatos` e `/mandatos/novo` disponiveis.
- Estrutura flexivel para orgaos institucionais adicionada: Diretoria Executiva, Conselho Fiscal, Conselho Consultivo, Comites Cientificos, Tecnicos, de Projetos, de Pesquisa, de Etica e outros.
- Telas `/orgaos`, `/orgaos/novo` e `/orgaos/[id]` disponiveis para configuracao de orgaos e integrantes.

Diretriz de governanca:

- O sistema nao deve limitar a entidade a Diretoria Executiva e Conselho Fiscal.
- A entidade deve poder configurar outros orgaos estatutarios, regimentais ou consultivos.
- Integrantes podem ser membros cadastrados ou participantes externos, quando houver especialistas convidados.
- Funcoes dentro do orgao devem aceitar papeis padronizados e nome personalizado.
- A matriz estatutaria em `materiais/matriz-estatutaria-oscs.md` deve orientar categorias de associados, orgaos administrativos, assembleias, mandatos e competencias.
- A matriz real em `materiais/matriz-estatutaria-instituto-incentive.md` deve orientar a configuracao piloto do Instituto Incentive.

Validacao realizada:

- Prisma validate: aprovado.
- Testes backend: 12 testes aprovados.
- Build API + frontend: aprovado.

Pendencias recomendadas para piloto:

- Criar carga inicial da associacao piloto.
- Criar diretoria e conselho fiscal reais ou semi-reais.
- Criar conselhos e comites adicionais previstos no estatuto ou regimento.
- Revisar nomes dos cargos e funcoes conforme estatuto da OSC.
- Definir se um membro pode acumular cargos em alguma excecao estatutaria. Hoje o sistema bloqueia mandato ativo sobreposto para o mesmo membro.
- Definir regras de direito a voto, elegibilidade e tempo minimo de filiacao por categoria de associado.
- Para o Instituto Incentive, considerar mandato de 4 anos, uma reconducao, cargos de Diretor Presidente, Diretor Administrativo-Financeiro e Diretor Tecnico, Conselho Fiscal com 3 titulares e ate 3 suplentes, e vedacao de acumulacao entre Diretoria Executiva e Conselho Fiscal.

## Modulo 2 - Governanca e Assembleias

Objetivo: registrar decisoes institucionais com rastreabilidade.

Escopo implementado:

- Convocacao de assembleia.
- Ordem do dia.
- Controle de realizacao.
- Registro de ata.
- Lista de presenca.
- Quorum de primeira e segunda chamada conforme estatuto piloto.
- Mesa da assembleia, presencas e deliberacoes.
- Geracao de ata e lista de presenca a partir da assembleia.
- Eleicoes vinculadas a assembleia e orgao de governanca.
- Registro de chapas e candidatos.
- Homologacao de chapa eleita.
- Geracao de mandatos a partir da eleicao homologada.
- Vinculo de decisoes com documentos, projetos e prestacao de contas.

Resultado esperado:

- Toda decisao relevante deve ter origem institucional rastreavel.

Status atual:

- Telas `/assembleias`, `/assembleias/nova` e `/assembleias/[id]` disponiveis.
- Telas `/eleicoes`, `/eleicoes/nova` e `/eleicoes/[id]` disponiveis.
- Endpoints de assembleia, presenca, deliberacao, eleicao, chapa, candidato, homologacao e geracao de mandatos implementados.
- Mandatos gerados por eleicao registram origem em assembleia, eleicao e orgao de governanca.
- Regra de assentos numerados adicionada para permitir, por exemplo, titulares e suplentes do Conselho Fiscal sem liberar duplicidade de Presidente.

Validacao realizada:

- Prisma validate: aprovado.
- Banco local sincronizado com Prisma db push.
- Testes backend: 15 testes aprovados.
- Build API + frontend: aprovado.

## Modulo 3 - Tesouraria e Contabilidade

Objetivo: controlar receitas, despesas, fundos, contas e centros de custo.

Escopo implementado:

- Contas financeiras.
- Lancamentos.
- Fundos restritos.
- Centros de custo.
- Conciliacao basica.
- Conciliacao bancaria com movimentos de extrato.
- Vinculo entre movimento bancario e lancamento financeiro.
- Bloqueio de conciliacao quando valor, conta ou natureza nao conferem.
- Desfazer conciliacao e ignorar movimento bancario com trilha de auditoria.
- Solicitacao de pagamento antes do lancamento financeiro.
- Bloqueio por ausencia de documento habil.
- Bloqueio por contrato obrigatorio ausente.
- Bloqueio por certidao negativa ausente ou vencida.
- Aprovacao conjunta com duas assinaturas distintas.
- Obrigatoriedade de assinatura do Diretor Presidente ou Diretor Administrativo-Financeiro.
- Baixa financeira criando lancamento contabil vinculado.
- Registro de AuditLog para criacao, aprovacao, rejeicao e baixa.
- Vinculo opcional com projeto de prestacao de contas, fundo e documento.
- Regularizacao documental de pagamento bloqueado sem recriar solicitacao.
- Resumo fiscal de pagamentos por status, valores, vencidos e principais bloqueios.
- Relatorio de pagamentos para Conselho Fiscal em PDF e XLS.
- Historico de relatorios de tesouraria gerados, com download posterior.
- Relatorios financeiros essenciais.

Resultado esperado:

- Toda movimentacao usada em prestacao de contas deve sair da tesouraria.

Status atual:

- Endpoints de solicitacao, listagem, detalhe, bloqueios, aprovacao, rejeicao e baixa de pagamento implementados.
- Telas `/tesouraria/pagamentos`, `/tesouraria/pagamentos/novo` e `/tesouraria/pagamentos/[id]` disponiveis.
- Rotas antigas de tesouraria expostas no app principal: `/tesouraria`, `/tesouraria/plano-contas` e `/tesouraria/lancamentos/novo`.
- Pagamento aprovado gera `FinancialEntry` vinculado a `PaymentRequest`.
- Tela de detalhe permite regularizar documento, contrato, certidao, fundo e projeto de prestacao.
- Lista de pagamentos exibe resumo fiscal para acompanhamento do Conselho.
- Tela `/tesouraria/conciliacao` registra movimentos bancarios, sugere lancamentos compativeis e permite conciliar, desfazer ou ignorar.
- Tela `/tesouraria/relatorios` gera e lista relatorios de pagamentos em PDF e XLS.
- Relatorios de tesouraria geram registro em banco e AuditLog.
- Build final reconhece as rotas de tesouraria.

Validacao realizada:

- Prisma validate: aprovado.
- Banco local sincronizado com Prisma db push.
- Testes backend: 15 testes aprovados.
- Build API + frontend: aprovado.

## Modulo 4 - Compras e Contratacoes MROSC

Objetivo: controlar selecao de fornecedores com rastreabilidade, economicidade e documentos do processo.

Fluxo oficial:

1. Edital de Cotacao Previa.
2. Mapa de Precos.
3. Ata de Selecao de Fornecedores.
4. Homologacao de Selecao de Fornecedor.
5. Contrato.

Escopo implementado:

- Cadastro de fornecedores com CNPJ unico por associacao.
- Processo de compra vinculado opcionalmente a projeto de prestacao de contas.
- Itens do edital com quantidade, unidade e preco estimado.
- Registro de propostas por fornecedor e item.
- Mapa de precos calculado automaticamente por menor preco unitario.
- Indicacao de itens com menos de tres cotacoes.
- Selecao de fornecedores vencedores.
- Homologacao do processo.
- Registro de contrato vinculado ao fornecedor selecionado.
- Vinculo opcional de pagamento a contrato MROSC.
- Registro de AuditLog para fornecedores, processos, itens, propostas, selecao, homologacao e contrato.

Status atual:

- Endpoints de fornecedores, processos, itens, propostas, mapa de precos, selecao, homologacao e contrato implementados.
- Telas `/compras`, `/compras/novo` e `/compras/[id]` disponiveis.
- Menu lateral atualizado com Compras MROSC.
- O processo registra documentos estruturais: edital, mapa de precos, ata de selecao, homologacao e contrato.

Validacao realizada:

- Prisma validate: aprovado.
- Banco local sincronizado com Prisma db push.
- Testes backend: 15 testes aprovados.
- Build API + frontend: aprovado.

Pendencias recomendadas para evolucao:

- Gerar PDFs oficiais a partir dos modelos enviados de edital, ata, homologacao e contrato.
- Importar mapa de precos a partir de XLSX/CSV.
- Integrar certidoes negativas do fornecedor antes do contrato e pagamento.
- Bloquear pagamento quando contrato ou certidoes estiverem ausentes/vencidos.

## Modulo 5 - Documentos Oficiais

Objetivo: gerar documentos oficiais sem edicao manual.

Escopo inicial:

- Ata.
- Lista de presenca.
- Estatuto consolidado.
- Oficio ou requerimento.
- Parecer fiscal.

Resultado esperado:

- Documento gerado deve ter hash, origem, responsavel e registro de auditoria.

## Modulo 6 - Prestacao de Contas Automatica

Objetivo: transformar dados financeiros, documentos e pareceres em prestacao de contas.

Escopo inicial:

- Projeto de prestacao.
- Documentos obrigatorios.
- Checklist automatico.
- Parecer fiscal.
- Relatorios PDF e XLS.
- Submissao com bloqueios.

Resultado esperado:

- O sistema deve bloquear submissao incompleta e liberar apenas prestacao validada.

## Modulo 7 - Auditoria e Compliance

Objetivo: registrar trilhas, alertas e riscos.

Escopo inicial:

- AuditLog.
- Alertas documentais.
- Riscos financeiros.
- Riscos juridicos.
- LGPD e segregacao de funcoes.

Resultado esperado:

- Toda acao sensivel deve ser rastreavel.

## Modulo 8 - BI e Indicadores

Objetivo: transformar dados operacionais em indicadores de gestao.

Escopo inicial:

- Indicadores financeiros.
- Indicadores de governanca.
- Indicadores documentais.
- Indicadores de prestacao de contas.

Resultado esperado:

- Diretoria e conselho devem conseguir enxergar riscos e desempenho rapidamente.

## Modulo 9 - Frontend, UX e Design System

Objetivo: criar uma interface moderna, acessivel e consistente para os modulos operacionais do INSTITUI+.

Diretrizes visuais:

- Padrao internacional para ERP/SaaS operacional.
- Fundo claro para area de trabalho e navegacao lateral navy de alto contraste.
- Paleta com azul institucional, teal, verde, ambar e vermelho para estados operacionais.
- Tipografia Inter com fallback seguro.
- Foco visivel para navegacao por teclado.
- Botões com contraste forte, altura confortavel e estados claros.
- Cards, tabelas, formularios e menus com raio maximo de 8px.
- Design escopado ao layout administrativo para nao quebrar paginas publicas.

Figma:

- Arquivo criado: https://www.figma.com/design/nwdlcF7KGW0guVk2SKTIBi
- Conteudo inicial: tokens de cor, componentes base, navegacao, cards, campos, tabela e tela modelo de Compras MROSC.

Status atual:

- Tema administrativo aplicado em `globals.css`.
- Layout institucional modernizado com sidebar navy, cabecalho claro, busca e skip link.
- Dashboard conectado aos endpoints de status institucional e linha do tempo juridica.
- Tela de novo lancamento financeiro reescrita para usar o cliente central de API.
- Build API + frontend: aprovado.

## Proximo passo tecnico

Avancar na integracao entre Frontend/UX, Compras MROSC, Documentos Oficiais, Tesouraria e Auditoria, priorizando:

1. Aplicar o novo padrao visual, modulo por modulo, nas telas internas restantes.
2. Gerar PDFs oficiais de edital, mapa de precos, ata, homologacao e contrato.
3. Integrar certidoes negativas do fornecedor ao bloqueio de contrato e pagamento.
4. Evoluir relatorios por centro de custo, projeto, fundo e processo de compra.
5. Criar alertas automatizados para vencimento de certidoes, contratos e pagamentos pendentes.
