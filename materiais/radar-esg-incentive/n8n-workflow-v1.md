# Workflow n8n v1 - Radar ESG Incentive

Este roteiro descreve a primeira automacao segura para coleta, classificacao e alerta de empresas com potencial de parceria para o Instituto Incentive.

## Principio operacional

O robo deve encontrar e organizar leads. Ele nao deve enviar mensagens em massa, raspar perfis pessoais de forma agressiva, nem abordar empresas automaticamente.

## Variaveis recomendadas

Guardar como credenciais ou variaveis seguras do n8n:

- `APIFY_TOKEN`: token do Apify, caso a busca use actor.
- `SEARCH_PROVIDER_API_KEY`: chave do provedor de busca, se usar SerpAPI ou Google Custom Search.
- `SUPABASE_URL`: URL do projeto Supabase.
- `SUPABASE_SERVICE_ROLE_KEY`: chave de servidor, somente no n8n.
- `ALERT_EMAIL_TO`: email que recebera alertas.
- `TELEGRAM_BOT_TOKEN`: opcional para alertas.
- `TELEGRAM_CHAT_ID`: opcional para alertas.

## Workflow no por no

### 1. Cron

Executa 1 vez por dia ou 2 vezes por semana no MVP.

Configuracao inicial sugerida:

- Dias uteis.
- Horario comercial.
- Limite de 20 a 50 resultados por execucao.

### 2. Set - palavras-chave

Cria uma lista de termos de busca:

- `empresa ESG Ceara`
- `empresa sustentabilidade Nordeste`
- `programa responsabilidade social empresa`
- `empresa patrocinio cultural`
- `empresa investimento social privado`
- `empresa apoia projetos sociais`
- `edital patrocinio empresa`
- `relatorio ESG educacao cultura inclusao produtiva`
- `instituto empresarial investimento social`

### 3. Split In Batches

Processa uma palavra-chave por vez para evitar volume alto e facilitar auditoria.

### 4. HTTP Request - busca

Pode usar uma destas opcoes:

- Apify Google Search Results Scraper.
- SerpAPI.
- Google Custom Search.

Campos minimos esperados:

- titulo do resultado.
- URL.
- snippet.
- palavra-chave usada.

### 5. Function - normalizar resultados

Transforma os resultados em um formato unico:

```json
{
  "nome_possivel": "",
  "url": "",
  "snippet": "",
  "fonte": "google",
  "termo_busca": "",
  "data_coleta": ""
}
```

### 6. IF - remover resultados nao aderentes

Descartar URLs que claramente nao sao empresas ou fontes uteis:

- redes sociais sem contexto institucional.
- paginas de vagas.
- marketplaces genericos.
- PDFs sem nome de empresa.
- noticias duplicadas sem fonte institucional.

### 7. HTTP Request - acessar site ou pagina encontrada

Baixa HTML da pagina publica. No MVP, limitar a primeira pagina e, se houver, paginas com termos:

- sustentabilidade.
- ESG.
- responsabilidade social.
- instituto.
- fundacao.
- patrocinio.
- edital.

### 8. AI Classifier - classificar lead

Usar o prompt de `prompts-classificacao.md`.

Saida obrigatoria em JSON:

```json
{
  "empresa": "",
  "segmento": "",
  "cidade": "",
  "estado": "",
  "atua_ce": "Nao identificado",
  "atua_nordeste": "Nao identificado",
  "possui_esg": "Nao identificado",
  "possui_instituto_fundacao": "Nao identificado",
  "utiliza_leis_incentivo": "Nao identificado",
  "possui_programa_social": "Nao identificado",
  "possui_edital_aberto": "Nao identificado",
  "investe_educacao": "Nao identificado",
  "investe_cultura": "Nao identificado",
  "areas_interesse": [],
  "evidencia": "",
  "fonte_url": "",
  "confianca": 0
}
```

### 9. Function - calcular score

Regra:

```text
Atua CE = 10
Atua Nordeste = 10
Possui ESG = 15
Possui Instituto/Fundacao = 15
Investe Educacao = 15
Investe Cultura = 15
Utiliza Leis de Incentivo = 10
Possui Programa Social = 10
```

Classificacao:

- score >= 80: Prioridade A.
- score >= 60: Prioridade B.
- score >= 40: Prioridade C.
- abaixo de 40: Baixa prioridade.

### 10. Supabase - upsert empresa

Salvar ou atualizar por:

- `site`.
- `razao_social` ou `nome_fantasia`, quando confiavel.
- `fonte_url`.

Nao criar duplicata se a empresa ja existir.

### 11. Supabase - inserir evidencia

Registrar fonte e trecho de evidencia para auditoria.

No MVP, pode ficar no campo `evidencia_encontrada` da tabela `empresas`.

### 12. IF - prioridade A

Se `prioridade = Prioridade A`, seguir para alerta.

Se nao, apenas salvar no banco.

### 13. Email ou Telegram - alerta

Modelo:

```text
Novo lead Prioridade A encontrado

Empresa: {{$json.empresa}}
Segmento: {{$json.segmento}}
Score: {{$json.score}}
Area: {{$json.areas_interesse}}
Evidencia: {{$json.evidencia}}
Fonte: {{$json.fonte_url}}

Acao sugerida: validar lead e pesquisar contato institucional.
```

### 14. Manual Review

Antes de contato externo:

- validar site.
- confirmar evidencia.
- checar se a empresa realmente se conecta aos projetos do Instituto Incentive.
- preparar mensagem personalizada.

## Limites do MVP

- Nao faz abordagem automatica.
- Nao coleta dados privados.
- Nao garante que todo resultado seja empresa.
- Nao substitui validacao humana.
- Nao deve consultar LinkedIn de forma agressiva.

## Evolucao futura

- Deduplicacao avancada por CNPJ e dominio.
- Dashboard web dentro do INSTITUI+.
- Integracao com CRM.
- Monitor de editais separado.
- Enriquecimento por CNPJ em fontes oficiais.
- Workflow de follow-up comercial.
