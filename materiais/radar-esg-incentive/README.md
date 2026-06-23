# Radar ESG Incentive

MVP do Robo 01 do Instituto Incentive para mapear, qualificar e priorizar empresas com potencial de patrocinio, investimento social privado, leis de incentivo e parcerias ESG.

## Entregaveis desta pasta

- `base-radar-esg-incentive.xlsx`: planilha-base com dashboard, cadastro de empresas, contatos, editais, historico, propostas, scoring e listas de apoio.
- `n8n-workflow-v1.md`: roteiro tecnico do workflow no n8n, no por no.
- `supabase-schema.sql`: estrutura inicial de banco para migrar a planilha para Supabase.
- `prompts-classificacao.md`: prompts para classificacao de leads, evidencias e scoring com IA.

## Objetivo do robo

Encontrar empresas que tenham sinais publicos de:

- ESG e sustentabilidade.
- Responsabilidade social.
- Educacao, cultura, inclusao produtiva e meio ambiente.
- Institutos, fundacoes ou programas sociais.
- Editais de patrocinio.
- Uso de leis de incentivo.

O resultado esperado nao e abordar automaticamente. O resultado esperado e gerar uma base qualificada para abordagem humana e personalizada.

## Como usar a planilha

1. Abra `base-radar-esg-incentive.xlsx`.
2. Preencha a aba `01_Empresas` com empresas encontradas manualmente ou por automacao.
3. Registre sempre a evidencia encontrada e a URL da fonte.
4. Marque os campos `Sim`, `Nao` ou `Nao identificado` conforme a evidencia.
5. O score e a prioridade sao calculados automaticamente.
6. Use `02_Contatos` somente para contatos publicos ou legitimamente obtidos.
7. Use `04_Historico` para registrar cada interacao humana.
8. Use `05_Propostas` para acompanhar propostas enviadas e valor potencial.

## Criterios de scoring

| Criterio | Pontos |
| --- | ---: |
| Atua no Ceara | 10 |
| Atua no Nordeste | 10 |
| Possui ESG ou sustentabilidade | 15 |
| Possui instituto ou fundacao | 15 |
| Investe em educacao | 15 |
| Investe em cultura | 15 |
| Utiliza leis de incentivo | 10 |
| Possui programa social | 10 |

Classificacao:

- 80 a 100: Prioridade A.
- 60 a 79: Prioridade B.
- 40 a 59: Prioridade C.
- 0 a 39: Baixa prioridade.

## Regras de seguranca

- LinkedIn deve ser usado para pesquisa e organizacao, nao para disparo em massa.
- Nao inventar contato, cargo, email ou evidencia.
- Nao salvar dados pessoais sensiveis.
- Salvar apenas informacoes publicas, institucionais ou legitimamente fornecidas.
- Toda abordagem deve ser revisada por uma pessoa antes do envio.
- Cada lead precisa ter uma fonte verificavel.

## Fase 1 recomendada

Semana 1:

- Usar a planilha como base manual.
- Cadastrar 30 a 50 empresas.
- Validar se o score faz sentido para o Instituto Incentive.

Semana 2:

- Conectar busca via Apify, SerpAPI ou Google Custom Search.
- Automatizar importacao de resultados para uma aba de triagem.
- Manter aprovacao humana antes de virar lead oficial.

Semana 3:

- Criar workflow n8n para classificacao e alertas.
- Salvar dados no Supabase.
- Alertar apenas leads Prioridade A.

Semana 4:

- Criar dashboard operacional.
- Medir empresas mapeadas, leads A, contatos encontrados, reunioes e propostas.

## Proximo passo tecnico

Implementar o fluxo descrito em `n8n-workflow-v1.md`, usando a planilha como origem inicial ou migrando para o schema `supabase-schema.sql`.
