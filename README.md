# Instituto Incentive - novo site

Repositório para construção do novo site público do Instituto Incentive.

O projeto reúne a vitrine institucional, página de áreas de atuação, projetos, contato e uma área de Transparência com documentos institucionais, certidões, licenças e demonstrações financeiras já publicados.

## Estrutura

- `apps/frontend`: site público em Next.js.
- `apps/api`: base interna/API já existente no projeto.
- `materiais`: materiais editoriais, benchmark e documentos de apoio para publicação.
- `.github/workflows`: validações automáticas para o GitHub.

## Páginas públicas atuais

- `/`
- `/quem-somos`
- `/areas-de-atuacao`
- `/projetos`
- `/transparencia`
- `/contato`

## Como rodar localmente

Instale as dependências:

```bash
npm install
```

Rode o site:

```bash
npm run dev --workspace=apps/frontend
```

Abra:

```text
http://localhost:3000
```

## Como validar

Build do site público:

```bash
npm run build --workspace=apps/frontend
```

## Publicação na Vercel

Configuração recomendada ao importar o repositório:

- Repositório: `PedroGerard/instituto-incentive-site`
- Framework: Next.js
- Root Directory: `apps/frontend`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: deixar padrão do Next.js

O workflow do GitHub já valida o build do frontend antes de publicar mudanças.

## Identidade visual

A paleta do site segue o manual visual do Instituto Incentive:

- Verde/teal institucional: `#006871`
- Laranja principal: `#ff9507`
- Cinza claro secundário: `#f6f6f6`

Essas cores estão centralizadas em `apps/frontend/app/globals.css` como tokens CSS para manter botões, links, cards, fundos e rodapés consistentes com a marca.

Assets vetoriais de apoio:

- `apps/frontend/public/images/brand/instituto-incentive-pattern.svg`: faixa institucional em alta qualidade para uso no site.
- `apps/frontend/public/images/brand/instituto-incentive-palette.svg`: referência visual da paleta oficial.

## Transparência

A página `/transparencia` já publica 16 documentos em PDF organizados em:

- Documentos institucionais.
- Licenças e conformidade.
- Certidões negativas e regularidade.
- Relatórios e contas.

Documentos já disponíveis:

- Estatuto Social.
- Ata de eleição e posse da diretoria.
- CNPJ e certidões.
- Alvarás e certificado de conformidade.
- Demonstrações contábeis.
- Certidões federal, estadual, municipal, trabalhista, FGTS, falência/recuperação judicial e entes privados.

Documentos ainda pendentes ou em organização:

- Relatório de Atividades 2026.
- Diretoria, conselhos e mandatos.
- Parecer do Conselho Fiscal, quando houver.
- Código de Conduta.
- Política de Privacidade.
- Política de Transparência.
- Instrumentos de parceria pública, planos de trabalho e prestações de contas.

Novos documentos devem passar por validação da diretoria antes de publicação, com atenção a dados pessoais e informações sensíveis.

## Materiais de apoio

O arquivo `materiais/benchmark-e-reconfiguracao-site.md` consolida a leitura da proposta antiga, referências de boas práticas e recomendações para o novo site.
