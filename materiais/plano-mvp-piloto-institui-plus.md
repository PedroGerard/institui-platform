# Plano MVP Piloto - INSTITUI+

Atualizado em 14 de junho de 2026.

## 1. Estado atual verificado

- Schema Prisma validado com sucesso.
- Banco PostgreSQL local sincronizado com o schema.
- Testes automatizados do backend passaram.
- Build completo da API e do frontend passou.
- API respondeu em `/health`.
- Frontend respondeu em `/prestacao-contas`.
- Frontend administrativo passou a operar com contexto de associacao ativa, sem ID fixo nos fluxos criticos.
- PR #9 aberto para a Sprint 00 com a correcao de associacao ativa.
- CI do monorepo preparado para validar Prisma, gerar Prisma Client, testar/buildar API e buildar frontend.
- Roadmap de desenvolvimento consolidado em `materiais/roadmap-desenvolvimento-institui-plus.md`.

Observacao operacional: neste ambiente Codex, os servidores locais sobem corretamente em primeiro plano, mas o sandbox encerra processos quando tentamos mante-los em segundo plano. Para uso continuo, a execucao deve ser feita no terminal local do usuario ou em ambiente de deploy.

## 2. Objetivo do MVP piloto

Entregar uma primeira versao utilizavel do INSTITUI+ para uma OSC piloto, cobrindo o fluxo essencial:

1. Cadastro institucional da associacao.
2. Cadastro de membros, conselhos e mandatos.
3. Criacao de prestacao de contas.
4. Anexo e validacao de documentos obrigatorios.
5. Checklist automatico de pendencias.
6. Registro de parecer fiscal.
7. Geracao de relatorios e documentos oficiais.
8. Registro de auditoria dos eventos relevantes.

## 3. Dados necessarios para tirar do papel

- Dados da OSC piloto: nome, CNPJ, endereco, data de fundacao e contatos oficiais.
- Estatuto vigente ou minuta consolidada.
- Lista inicial de associados e situacao de cada um.
- Diretoria atual: cargos, nomes, datas de inicio e fim dos mandatos.
- Conselho Fiscal atual: membros, mandato e regra de aprovacao.
- Modelos reais de ata, lista de presenca, oficio, requerimento e parecer fiscal.
- Um projeto ou instrumento real/semi-real de prestacao de contas.
- Documentos de exemplo: contrato, nota fiscal, recibo, extrato, certidoes e relacao de bens.
- Regras de validacao documental usadas pela OSC ou pelo concedente.
- Decisao de ambiente: local, servidor proprio, Vercel + banco gerenciado, ou outra nuvem.

## 4. Sprint 01 - Piloto operacional

Meta: transformar o sistema atual em um piloto navegavel com dados reais da OSC.

- Revisar tela inicial administrativa e fluxo de entrada do usuario.
- Criar carga inicial da associacao piloto.
- Criar carga inicial de usuarios, associados, diretoria e conselho fiscal.
- Validar fluxo completo de membros e mandatos.
- Validar fluxo completo de prestacao de contas com documentos obrigatorios.
- Ajustar templates de documentos oficiais com linguagem juridica da OSC.
- Conferir relatorios PDF/XLS com dados reais.
- Validar trilha de auditoria dos eventos principais.

## 5. Sprint 02 - Publicacao controlada

Meta: colocar a versao piloto em ambiente acessivel para teste real.

- Definir banco de dados gerenciado.
- Definir hospedagem da API.
- Definir hospedagem do frontend.
- Configurar variaveis de ambiente.
- Criar rotina de backup.
- Configurar dominio/subdominio de homologacao.
- Testar acesso com usuarios reais.
- Registrar erros e ajustes do piloto.

## 6. Proxima decisao

Escolher a OSC piloto e separar os dados institucionais minimos. Com isso, o proximo trabalho tecnico e criar a carga inicial e fechar o fluxo ponta a ponta de prestacao de contas.
