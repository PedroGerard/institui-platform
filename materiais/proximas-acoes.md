# Proximas acoes - Instituto Incentive

Atualizado em 06 de julho de 2026.

## Concluido

- Dominio `institutoincentive.org.br` cadastrado na Vercel.
- Redirecionamento do dominio raiz para `www.institutoincentive.org.br`.
- Certificado SSL ativo pela Vercel.
- Projeto oficial da Vercel apontando para a raiz do repositorio.
- Site institucional separado da base da plataforma ERP.
- Paginas publicas principais publicadas: Inicio, Quem Somos, Areas de Atuacao, Projetos, Certificacoes, Transparencia, Emendas Parlamentares, Apoie e Contato.
- Vercel Web Analytics e Speed Insights instalados.
- Consentimento de cookies criado para ativar ferramentas opcionais somente apos aceite.
- Headers basicos de seguranca configurados no Next.js.
- Dependabot preparado para monitorar dependencias npm e GitHub Actions.

## Prioridade 1 - Google e mensuracao

- Validar o dominio no Google Search Console.
- Enviar o sitemap `https://www.institutoincentive.org.br/sitemap.xml`.
- Criar propriedade GA4 ou container Google Tag Manager.
- Cadastrar na Vercel as variaveis:
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - `NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID`
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
- Definir conversoes iniciais para contato, apoio, projetos, documentos e redes sociais.
- Preparar a conta do Google Ad Grants depois que Search Console e Analytics estiverem funcionando.

## Prioridade 1 - Seguranca operacional

- Ativar 2FA nas contas GitHub, Vercel, Registro.br/DNS e Google usadas pelo Instituto.
- Avaliar Cloudflare ou Vercel Firewall/WAF para protecao adicional de borda.
- Manter Next.js, React e dependencias atualizados com apoio do Dependabot.
- Salvar backup externo dos documentos publicos e materiais editoriais.
- Monitorar disponibilidade do dominio oficial com UptimeRobot, Better Stack ou ferramenta equivalente.
- Proteger a branch `main` quando o plano do GitHub permitir branch protection em repositorio privado.

## Prioridade 2 - Conteudo e experiencia

- Revisar a pagina inicial com a diretoria apos alguns dias de uso.
- Validar se o menu principal ficou intuitivo em desktop e celular.
- Confirmar se a pagina Apoie atende aos objetivos de parcerias, voluntariado e apoio institucional.
- Revisar o rodape apos definicao final de politicas, contatos e canais oficiais.
- Manter a curadoria de imagens com fotos profissionais ligadas ao Ceara, Vale do Jaguaribe, Pereiro, cultura, educacao, caatinga e desenvolvimento comunitario.

## Prioridade 3 - Transparencia

- Publicar novas politicas institucionais quando forem validadas pela diretoria.
- Revisar periodicamente se os PDFs publicados continuam atuais.
- Adicionar novos documentos oficiais somente apos validacao institucional.
- Atualizar Emendas Parlamentares imediatamente caso haja recebimento futuro.
- Registrar data de atualizacao em documentos sensiveis de transparencia.

## Prioridade 4 - Repositorios e organizacao tecnica

- Manter a raiz atual do repositorio `institui-platform` dedicada ao site institucional publico.
- Nao misturar ERP, API, banco de dados ou modulo administrativo na raiz publica do site.
- Confirmar se `nextjs-boilerplate` e apenas um modelo antigo sem uso antes de excluir.
- Proteger a branch `main` nos repositorios principais.
- Criar um fluxo simples de publicacao: alterar, validar, enviar ao GitHub e acompanhar deploy.

## Checklist apos cada alteracao no site

1. Rodar validacao local.
2. Rodar build.
3. Conferir links principais.
4. Enviar commit ao GitHub.
5. Acompanhar deploy na Vercel.
6. Testar `https://www.institutoincentive.org.br`.
