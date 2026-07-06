# Instituto Incentive Site

Repositorio do site institucional publico do Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social.

## Escopo deste repositorio

Este repositorio deve conter somente materiais do site publico:

- paginas institucionais;
- projetos e areas de atuacao;
- portal da transparencia;
- emendas parlamentares;
- certificacoes e reconhecimentos;
- documentos publicos;
- configuracoes de deploy do site na Vercel;
- materiais editoriais e SEO do site.

O sistema de gestao/ERP INSTITUI+ fica fora da raiz publica deste site.
Nao misturar arquivos de ERP, API, banco de dados ou modulo administrativo nesta base.

```text
Repositorio atual: https://github.com/PedroGerard/institui-platform
Raiz ativa do site: /
```

## Estrutura

```text
app/                  Paginas publicas do site em Next.js
src/                  Componentes, configuracoes e utilitarios
public/               Imagens, documentos e arquivos publicos
materiais/            Materiais editoriais, SEO, imagens e publicacao do site
.github/workflows/    Validacao automatica do site
```

## Rodar localmente

```bash
npm ci
npm run dev
```

URL local:

```text
http://localhost:3000
```

## Validar

```bash
npm run lint
npm run build
```

## Fluxo de publicacao

1. Criar uma branch curta a partir de `main`.
2. Alterar conteudo ou codigo.
3. Rodar `npm ci`, `npm run lint` e `npm run build`.
4. Abrir pull request para `main`.
5. Conferir validacao automatica do GitHub Actions.
6. Fazer merge e acompanhar o deploy na Vercel.
7. Conferir o dominio oficial apos a publicacao.

## Publicacao

Projeto oficial na Vercel:

```text
frontend-do-site-de-incentivos-do-instituto
```

Configuracao:

- Root Directory: vazio / raiz do repositorio
- Install Command: `npm ci`
- Build Command: `npm run build`
- Production Branch: `main`
- Dominio principal: `www.institutoincentive.org.br`

## Seguranca

Este site nao possui banco de dados, login proprio, painel administrativo publico ou API interna. A seguranca principal fica em quatro camadas:

- HTTPS e headers de seguranca configurados no Next.js/Vercel;
- dependencias atualizadas com apoio do Dependabot;
- 2FA e menor privilegio nas contas GitHub, Vercel, DNS e Google;
- fluxo de publicacao com branch, validacao, pull request e deploy monitorado.

Detalhes: [SECURITY.md](SECURITY.md).

## Observacao importante

Nao adicionar arquivos do ERP, API, banco de dados ou modulo administrativo nesta raiz do site publico.
