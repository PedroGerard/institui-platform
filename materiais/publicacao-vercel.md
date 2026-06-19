# Publicacao na Vercel

Guia rapido para publicar o novo site do Instituto Incentive usando o repositorio GitHub.

## Repositorio

```text
https://github.com/PedroGerard/instituto-incentive-site
```

## Configuracao do projeto na Vercel

Ao importar o repositorio, usar:

- Framework Preset: `Next.js`
- Root Directory: `instituto-incentive-site`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: deixar em branco ou manter o padrao do Next.js

Nao selecionar a raiz do repositorio como projeto principal. O site publico esta dentro de `instituto-incentive-site`.
Tambem nao apontar o deploy publico para `instituto-platform/apps/frontend`, porque essa pasta agora e o sistema de gestao.

## Passo a passo

1. Acessar https://vercel.com.
2. Entrar com a conta GitHub `PedroGerard`.
3. Clicar em `Add New` e depois `Project`.
4. Importar o repositorio `instituto-incentive-site`.
5. Em `Root Directory`, selecionar `instituto-incentive-site`.
6. Conferir se o framework foi detectado como `Next.js`.
7. Conferir os comandos:

```text
Install Command: npm ci
Build Command: npm run build
```

8. Clicar em `Deploy`.

Se a Vercel preencher automaticamente `npm install --prefix=../..`, editar o campo e trocar por `npm ci`.

## Depois do primeiro deploy

Verificar:

- Home carrega corretamente.
- Paginas `/quem-somos`, `/projetos`, `/transparencia`, `/transparencia/emendas-parlamentares`, `/certificacoes-reconhecimentos` e `/contato` abrem.
- Imagens dos projetos aparecem.
- Links externos do Mapa Cultural abrem em nova aba.
- Area `/dashboard` nao deve existir no deploy do site; ela pertence ao ERP em `instituto-platform/apps/frontend`.

## Dominio

Dominio informado:

```text
institutoincentive.org.br
```

Depois que o deploy estiver aprovado, adicionar o dominio na Vercel e ajustar o DNS no provedor onde o dominio esta registrado.

## Pendencias antes de divulgar publicamente

- Confirmar e-mail oficial de contato.
- Confirmar endereco publico oficial.
- Publicar ou preparar documentos oficiais da aba Transparencia.
- Configurar deploy separado para o ERP administrativo quando a autenticacao estiver pronta.
- Integrar formulario de contato.
