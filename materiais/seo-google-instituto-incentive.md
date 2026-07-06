# SEO e presença Google - Instituto Incentive

Documento interno para orientar as próximas ações de presença digital do Instituto Incentive.

## Objetivo

Fortalecer a presença institucional do Instituto Incentive no Google, preparar a base para Google Ad Grants, melhorar indexação orgânica e facilitar validações por parceiros, conselhos, órgãos públicos e comunidade.

## O que foi implementado no site

- Metadados globais com domínio oficial, título, descrição e imagem institucional.
- Metadados específicos nas principais páginas públicas.
- Dados estruturados `NGO` em JSON-LD com nome, CNPJ, endereço, contato e redes sociais.
- `sitemap.xml` gerado automaticamente.
- `robots.txt` com liberação de indexação e referência ao sitemap.
- Manifesto do site com nome, cores e ícones da marca.
- Vercel Web Analytics e Speed Insights instalados no layout do site.
- Pagina `/apoie` criada para parcerias, voluntariado, apoio institucional e conversoes futuras.

## Ações recomendadas no Google Search Console

1. Acessar `https://search.google.com/search-console/about`.
2. Adicionar a propriedade de domínio `institutoincentive.org.br`.
3. Validar a propriedade pelo DNS, preferencialmente com registro TXT no Registro.br.
4. Enviar o sitemap:

```text
https://www.institutoincentive.org.br/sitemap.xml
```

5. Solicitar indexação da página inicial e das páginas principais.
6. Acompanhar cobertura, páginas indexadas, palavras de busca e problemas de experiência.

## Ações recomendadas no Google Perfil da Empresa

1. Criar ou reivindicar o perfil em `https://www.google.com/business/`.
2. Usar o nome institucional:

```text
Instituto Incentive de Inovacao, Desenvolvimento e Transformacao Social
```

3. Manter dados consistentes com o site:

```text
CNPJ: 04.347.564/0001-56
Endereco: Avenida Jose Milton de Morais, 394, Vila Nova, Pereiro/CE, CEP 63.460-000
Telefone: +55 (88) 99925-2123
E-mail: contato@institutoincentive.org.br
Site: https://www.institutoincentive.org.br
```

4. Inserir fotos reais do Instituto, fachada, equipe, oficinas, comunidade e territorio.
5. Publicar atualizacoes sobre projetos, certificacoes, transparencia e oportunidades.

## Preparacao para Google Ad Grants

Referencias oficiais:

- `https://www.google.com/grants/`
- `https://support.google.com/grants/answer/9042207`
- `https://www.google.com/nonprofits/`

Pontos de atencao antes de ativar campanhas:

- O site precisa estar em HTTPS, com dominio proprio e conteudo institucional substancial.
- As paginas de destino devem ter missao clara, navegacao completa, transparencia, contato e politicas.
- Anuncios devem direcionar para paginas relacionadas a causa social, projetos, contato ou oportunidades de parceria.
- As campanhas precisam ter metas de conversao relevantes, como envio de contato, clique em e-mail, clique em telefone ou acesso a paginas de projetos.
- Evitar paginas sem conteudo suficiente, promessas exageradas, linguagem comercial agressiva ou links quebrados.

## Medicao de conversoes

O site foi preparado para receber Google Analytics 4 e Google Tag Manager por variaveis de ambiente na Vercel.

Variaveis a configurar quando os IDs forem criados:

```text
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID=GTM-XXXXXXX
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=CODIGO_DO_SEARCH_CONSOLE
```

Use apenas o GA4 direto ou o GTM como centralizador, conforme a estrategia escolhida. Se o GA4 for instalado dentro do GTM, evite preencher os dois ao mesmo tempo para nao duplicar pageviews.

Eventos de conversao recomendados:

- `lead_form_submit`: envio do formulario de contato por e-mail.
- `contact_channel_click`: clique em e-mail, telefone ou site oficial.
- `social_link_click`: clique em Instagram, Facebook ou LinkedIn.
- `support_contact_click`: clique em chamadas de apoio, parceria ou voluntariado.
- `project_source_click`: clique para consultar projeto no Mapa Cultural.
- `document_open`: abertura de PDF institucional, transparencia, emendas ou certificacoes.
- `document_download`: download de declaracoes de emendas parlamentares.

Metas iniciais para Google Ad Grants:

- Conversao principal: `lead_form_submit`.
- Conversoes secundarias: `support_contact_click`, `contact_channel_click`, `project_source_click` e `document_open`.
- Publico de maior interesse: pessoas que buscam OSCs, projetos sociais, cultura, educacao, terceiro setor, transparencia e oportunidades de parceria no Ceara.

## Checklist para ativacao Google

1. Confirmar aprovacao do Instituto no Google para Organizacoes sem Fins Lucrativos.
2. Criar ou acessar a conta do Google Ads vinculada ao Ad Grants.
3. Criar uma propriedade GA4 para `institutoincentive.org.br`.
4. Enviar o ID `G-...` ou o container `GTM-...` para configuracao na Vercel.
5. Validar o dominio no Google Search Console por DNS.
6. Enviar o sitemap `https://www.institutoincentive.org.br/sitemap.xml`.
7. Criar ou reivindicar o Perfil da Empresa do Google com endereco, telefone, site e fotos.
8. Cadastrar conversoes no Google Ads com base nos eventos acima.
9. Criar campanhas por intencao de busca, com grupos separados para projetos, transparencia, contato/parcerias e terceiro setor.
10. Acompanhar CTR, termos de pesquisa, conversoes e paginas de destino todo mes.

## Palavras-chave iniciais sugeridas

- Instituto Incentive
- Instituto Incentive Pereiro
- ONG em Pereiro CE
- OSC no Ceara
- projetos sociais no Ceara
- projetos culturais em Pereiro
- terceiro setor no Ceara
- inclusao social Pereiro CE
- formacao profissional Pereiro
- cultura e educacao no semiarido
- transparencia OSC
- emendas parlamentares OSC transparencia

## Paginas prioritarias para campanhas futuras

- `/projetos`
- `/areas-de-atuacao`
- `/apoie`
- `/certificacoes-reconhecimentos`
- `/transparencia`
- `/transparencia/emendas-parlamentares`
- `/contato`

## Proximas tarefas

- Validar o site no Google Search Console.
- Verificar se Web Analytics e Speed Insights aparecem ativos no painel da Vercel depois do deploy.
- Criar ou revisar o Google Perfil da Empresa.
- Preparar fotos reais do territorio e das atividades do Instituto.
- Definir 3 a 5 metas de conversao para campanhas do Google Ad Grants.
