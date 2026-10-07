# Relatorio tecnico - pendencias criticas do site institucional

> Documento historico de diagnostico. Para comandos atuais de publicacao,
> usar `materiais/publicacao-vercel.md`.

Data: 30/06/2026

Projeto: Instituto Incentive - site institucional

Repositorio GitHub: `PedroGerard/instituto-incentive-site`

Projeto Vercel: `frontend-do-site-de-incentivos-do-instituto`

## 1. Resumo executivo

O site institucional esta funcional localmente e passou nas validacoes de codigo e build de producao. O principal problema critico identificado estava na configuracao de publicacao: a Vercel continuava apontando para a pasta antiga `instituto-incentive-site`, enquanto a estrutura correta do site passou a estar na raiz do repositorio.

Essa divergencia fazia com que novos deploys falhassem e impedia a publicacao das melhorias mais recentes, mesmo com o codigo local funcionando.

## 2. Problemas identificados

### 2.1. Raiz de publicacao incorreta na Vercel

Situacao encontrada:

- Vercel configurada com `rootDirectory: instituto-incentive-site`.
- Site institucional sendo reorganizado para a raiz do repositorio.
- Deploys recentes falhando mesmo com build local valido.

Risco:

- Publicacao de versoes antigas.
- Falha em deploys de producao.
- Dificuldade para validar alteracoes no dominio oficial.

Tratativa aplicada:

- Configuracao do projeto na Vercel ajustada para `rootDirectory: null`, que representa a raiz do repositorio.
- Arquivo local `.vercel/project.json` alinhado para evitar deploy manual usando configuracao antiga.

### 2.2. Mistura historica entre site institucional e plataforma ERP

Situacao encontrada:

- O repositorio do site ainda continha historico e estrutura herdada do monorepo.
- A pasta `instituto-platform` existe localmente, mas esta fora do versionamento do site.
- A pasta antiga `instituto-incentive-site` permanece localmente como residuo de transicao, mas passou a ser ignorada no Git.

Risco:

- Builds tentando validar arquivos do ERP.
- Confusao operacional entre o site publico e a plataforma de gestao.
- Deploys apontando para a pasta errada.

Tratativa aplicada:

- Site movido para a raiz com `app`, `src`, `public`, `package.json`, `package-lock.json`, `next.config.ts`, `tsconfig.json` e `vercel.json`.
- `.gitignore` ajustado para manter `instituto-platform/` e a pasta antiga `instituto-incentive-site/` fora do repositorio do site.
- README atualizado para refletir a nova estrutura.

### 2.3. Lint e TypeScript validando pastas fora do site

Situacao encontrada:

- O script de lint estava configurado como `eslint`, varrendo todo o repositorio.
- O `tsconfig.json` usava `**/*.ts` e `**/*.tsx`, incluindo arquivos do ERP e pastas antigas.

Risco:

- Falhas de build por arquivos que nao pertencem ao site.
- Validacoes lentas e instaveis.
- Erros falsos positivos no GitHub Actions e na Vercel.

Tratativa aplicada:

- `npm run lint` limitado a `app` e `src`.
- `tsconfig.json` limitado a arquivos do site.
- `eslint.config.mjs` atualizado para ignorar `instituto-platform`, `instituto-incentive-site`, `materiais`, `.tmp` e outras pastas locais.

### 2.4. GitHub Actions herdando estrutura antiga

Situacao encontrada:

- Workflow do frontend ainda usava `working-directory: instituto-incentive-site`.
- Cache do npm apontava para `instituto-incentive-site/package-lock.json`.

Risco:

- CI falhando apos a separacao da estrutura.
- Divergencia entre validacao local e validacao no GitHub.

Tratativa aplicada:

- Workflow ajustado para rodar na raiz.
- Cache atualizado para `package-lock.json` da raiz.

## 3. Validacoes executadas

### Lint

Resultado: aprovado.

Comando validado:

```bash
npm run lint
```

### Build de producao

Resultado: aprovado.

Comando validado:

```bash
npm run build
```

Paginas geradas no build:

- `/`
- `/quem-somos`
- `/areas-de-atuacao`
- `/projetos`
- `/certificacoes-reconhecimentos`
- `/transparencia`
- `/transparencia/emendas-parlamentares`
- `/contato`
- `/apoie`
- `/privacidade`
- `/acessibilidade`
- `/sitemap.xml`
- `/robots.txt`

## 4. Situacao atual

O site esta publicado a partir da raiz correta do repositorio e o deploy de producao foi confirmado.

Itens confirmados:

- Projeto conectado ao GitHub.
- Branch de producao: `main`.
- Web Analytics ativo.
- Speed Insights ativo.
- Root Directory corrigido para a raiz do repositorio.
- Dominio oficial respondendo em `https://www.institutoincentive.org.br`.
- `sitemap.xml` e `robots.txt` publicados.
- Home publicada com carrossel institucional.
- Consentimento de cookies implementado para Google Analytics/Tag Manager.

## 5. Pendencias restantes

### 5.1. Protecao da branch principal

Recomendado configurar no GitHub:

- Bloqueio contra force push.
- Bloqueio contra exclusao da branch `main`.
- Exigir pull request antes de alteracoes diretas em `main`.
- Exigir verificacao do workflow antes de merge em PRs.

Essa acao depende de permissao administrativa no GitHub.

Status em 30/06/2026:

- GitHub CLI autenticado com sucesso na conta `PedroGerard`.
- Tentativa de aplicar protecao inicial via API do GitHub retornou bloqueio do plano: repositórios privados exigem GitHub Pro ou tornar o repositório público para habilitar branch protection.
- Enquanto o plano atual nao permitir branch protection, a mitigacao recomendada e evitar push direto de terceiros e manter backups/commits frequentes.

### 5.2. Google Search Console, GA4 e Google Tag Manager

O codigo ja aceita as variaveis:

- `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`
- `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`

Pendente:

- Criar ou confirmar propriedade no Google Search Console.
- Enviar o sitemap `https://www.institutoincentive.org.br/sitemap.xml`.
- Criar propriedade GA4 ou container GTM.
- Definir conversoes para contato, apoio, cliques em documentos, projetos e redes sociais.
- Inserir as variaveis na Vercel.

Status em 30/06/2026:

- Consulta na Vercel confirmou que ainda nao ha variaveis de ambiente cadastradas no projeto oficial.
- Vercel Web Analytics e Speed Insights estao ativos, mas GA4/GTM dependem dos IDs do Google.

### 5.3. Repositorios antigos e limpeza externa

Diagnostico em 30/06/2026:

- Vercel lista apenas dois projetos: `frontend-do-site-de-incentivos-do-instituto` e `nextjs-boilerplate`.
- O projeto Vercel `instituto-incentive-site-frontend` nao apareceu mais na listagem atual.
- O repositorio GitHub `PedroGerard/nextjs-boilerplate` esta privado, sem descricao, com ultimo push em 02/01/2026 e contem apenas estrutura padrao de `create-next-app`.
- A pasta local antiga `instituto-incentive-site/` existe, mas esta incompleta e sem `package.json`; a parte funcional do site esta na raiz do repositorio.
- As pastas locais `instituto-platform/` e `instituto-incentive-site/` nao aparecem como arquivos versionados no repositorio do site.

Pendente de confirmacao final:

- Excluir o projeto Vercel `nextjs-boilerplate`, caso nao exista uso externo.
- Excluir o repositorio GitHub `PedroGerard/nextjs-boilerplate`, caso confirmado como descartavel.
- Excluir fisicamente a pasta local antiga `instituto-incentive-site/` somente depois de confirmacao final de que nenhum arquivo util permanece nela.

### 5.4. Acervo proprio de imagens

O site usa imagens profissionais externas de apoio, registradas em `materiais/fontes-imagens-site.md`.

Pendencia editorial:

- Substituir gradualmente imagens externas por fotos proprias do Instituto.
- Registrar autorizacao de uso de imagem quando houver pessoas identificaveis.
- Manter fonte/licenca das imagens externas em arquivo interno.

### 5.5. Politicas institucionais

Pendente de validacao institucional:

- Politica de Transparencia.
- Codigo de Conduta.
- Politica de Integridade.
- Politica de Privacidade ja existe como pagina, mas deve ser revisada juridicamente antes de ativar campanhas amplas.

## 6. Tratativas adicionais aplicadas

- Criado `.vercelignore` para impedir que pastas locais antigas, ERP, arquivos temporarios, logs e materiais internos entrem em deploy manual.
- Criado `materiais/fontes-imagens-site.md` para registrar origem e licenca das imagens usadas.

## 7. Recomendacao tecnica

O site ja esta em condicao tecnica de publicacao e divulgacao controlada. As proximas frentes devem ser:

1. Proteger a branch `main` no GitHub.
2. Concluir Search Console e GA4/GTM.
3. Configurar conversoes para Google Ad Grants.
4. Fazer revisao juridica das politicas.
5. Evoluir acervo proprio de imagens e relatos de impacto.
