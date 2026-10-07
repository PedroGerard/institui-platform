# Publicacao do novo site do Instituto Incentive

> Documento historico. Para publicacao atual, usar `materiais/publicacao-vercel.md`.
> A raiz ativa do site publico hoje e `/` no repositorio `PedroGerard/institui-platform`.

## Objetivo

Publicar o novo site institucional do Instituto Incentive com as paginas publicas:

- Home
- Quem somos
- Projetos
- Transparencia
- Certificacoes e reconhecimentos
- Emendas parlamentares
- Contato

## Estrutura local

Aplicacao: raiz do repositorio atual

Rotas principais:

- `/`
- `/quem-somos`
- `/projetos`
- `/transparencia`
- `/transparencia/emendas-parlamentares`
- `/certificacoes-reconhecimentos`
- `/contato`

Materiais de apoio:

- `materiais/projetos-incentive.md`
- `public/images/projects`

## Build

Comando de build do site:

```bash
npm run build
```

O `package.json` do frontend ja usa:

```bash
next build --webpack
```

## Hospedagem recomendada

Opcao simples: Vercel

Configuracao:

- Root directory: vazio / raiz do repositorio
- Framework: Next.js
- Install command: `npm ci`
- Build command: `npm run build`
- Output: padrao do Next.js

Guia detalhado:

- `materiais/publicacao-vercel.md`

Opcao alternativa: Cloudflare Pages, Netlify ou servidor proprio com Node.js.

## Dominio

Dominio informado:

```text
institutoincentive.org.br
```

Depois do deploy, apontar DNS do dominio para a hospedagem escolhida.

## Pendencias antes de publicar

- Confirmar e-mail oficial de contato.
- Endereco publico atualizado para Avenida Jose Milton de Morais, 394, Vila Nova, Pereiro-CE, CEP 63.460-000.
- Confirmar que a area administrativa do ERP nao esta misturada na raiz publica do site.
- Integrar o formulario de contato com e-mail, CRM ou ferramenta de formularios.
- Revisar imagens e autorizacoes de uso dos registros dos projetos.

## Checklist final

- Build aprovado.
- Home revisada.
- Pagina de projetos revisada.
- Pagina de transparencia revisada.
- Links externos do Mapa Cultural funcionando.
- Dominio configurado.
- Certificado HTTPS ativo.
- Formulario de contato testado.
