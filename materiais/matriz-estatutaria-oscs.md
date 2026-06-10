# Matriz estatutaria para OSCs - INSTITUI+

Atualizado em 05 de junho de 2026.

Base de referencia: modelo de estatuto para associacoes, com fundamento nas disposicoes gerais sobre pessoas juridicas e associacoes, especialmente a estrutura estatutaria indicada no Artigo 53 do Codigo Civil e no modelo SEBRAE informado pelo usuario.

## 1. Denominacao, sede, duracao e natureza juridica

Conteudo estatutario esperado:

- Nome da entidade.
- Sigla.
- Endereco completo.
- Natureza juridica: associacao civil, pessoa juridica de direito privado.
- Finalidade nao lucrativa.
- Duracao indeterminada.
- Regencia pelo estatuto e normas legais aplicaveis.

Impacto no sistema:

- Modelo `Association`.
- Tela institucional.
- Gerador de estatuto consolidado.
- Documentos oficiais.
- Prestacao de contas e identificacao da entidade.

## 2. Objetivos e finalidades institucionais

Conteudo estatutario esperado:

- Objetivos sociais.
- Areas de atuacao.
- Possibilidade de projetos, programas, convenios e parcerias.
- Defesa de direitos, impacto social, cultural, ambiental, educacional, cientifico ou outras finalidades.

Impacto no sistema:

- Cadastro institucional.
- Projetos.
- Prestacao de contas.
- Relatorios de impacto.
- BI social.

## 3. Nao discriminacao e principios institucionais

Conteudo estatutario esperado:

- Vedacao de discriminacao por cor, raca, credo, classe social, posicao politica, filosofia ou nacionalidade.
- Regras eticas e principios de atuacao.

Impacto no sistema:

- Compliance.
- Politicas institucionais.
- Auditoria.
- Gerador de documentos oficiais.

## 4. Patrimonio, receitas e nao distribuicao de resultados

Conteudo estatutario esperado:

- Nao distribuicao de lucros, dividendos ou excedentes.
- Aplicacao integral dos recursos nos objetivos institucionais.
- Bens permanentes, acervo, equipamentos e patrimonio.
- Regras para alienacao, oneracao ou permuta de bens.
- Possibilidade de doacoes, contribuicoes, auxilios e convenios.

Impacto no sistema:

- Tesouraria.
- Contabilidade.
- Relacao de bens.
- Fundos restritos.
- Prestacao de contas.
- Alertas de governanca para alienacao de bens.

## 5. Constituicao social e categorias de associados

Categorias estatutarias esperadas:

- Fundadores.
- Efetivos.
- Benemeritos.
- Colaboradores.
- Honorarios, quando previstos.

Impacto no sistema:

- `MemberType` deve suportar fundadores, efetivos, benemeritos, colaboradores e honorarios.
- Direitos de votar e ser votado podem variar por categoria.
- Tempo minimo de filiacao pode bloquear elegibilidade para cargo.
- Situacao do associado deve controlar pleno gozo de direitos.

## 6. Direitos e deveres dos associados

Direitos esperados:

- Apresentar sugestoes e propostas.
- Solicitar reconsideracao de atos.
- Participar de debates e deliberacoes.
- Votar e ser votado, conforme categoria e tempo de filiacao.
- Convocar assembleia com quorum minimo previsto.

Deveres esperados:

- Cumprir o estatuto.
- Zelar pelo bom nome da entidade.
- Participar de assembleias.
- Cumprir obrigacoes financeiras, quando houver.
- Respeitar normas internas.

Impacto no sistema:

- Regras de elegibilidade.
- Assembleias.
- Quorum.
- Mandatos.
- Registro de suspensao, desligamento ou exclusao.

## 7. Organizacao administrativa

Orgaos administrativos esperados:

- Assembleia Geral.
- Conselho Diretor.
- Secretaria Executiva.
- Conselho Fiscal.

Orgaos adicionais possiveis:

- Conselho Consultivo.
- Comite Cientifico.
- Comite Tecnico.
- Comite de Projetos.
- Comite de Pesquisa.
- Comite de Etica.
- Outros orgaos estatutarios, regimentais ou consultivos.

Impacto no sistema:

- O Core Institucional deve permitir orgaos configuraveis.
- `GovernanceBody` representa orgaos estatutarios, administrativos, consultivos, cientificos ou tecnicos.
- Integrantes podem ser associados ou participantes externos.
- Funcoes podem ser padronizadas ou personalizadas.

## 8. Assembleia Geral

Caracteristicas esperadas:

- Orgao maximo da entidade.
- Participacao de associados em pleno gozo de direitos.
- Reunioes ordinarias e extraordinarias.
- Convocacao pelo Conselho Diretor, Conselho Fiscal ou percentual de associados.
- Competencia para aprovar contas, admitir associados, eleger conselhos, deliberar sobre patrimonio e definir linhas de acao.

Impacto no sistema:

- Modulo de Assembleias.
- Convocacao.
- Lista de presenca.
- Quorum.
- Deliberacoes.
- Atas.
- Vinculo com mandatos, patrimonio, prestacao de contas e documentos oficiais.

## 9. Conselho Diretor ou Diretoria

Caracteristicas esperadas:

- Orgao colegiado.
- Minimo de membros definido no estatuto.
- Subordinado a Assembleia Geral.
- Responsavel pela representacao e administracao.
- Mandato definido, com ou sem reeleicao.
- Competencia para cumprir estatuto, elaborar orcamento, criar programas e aprovar regimentos.

Impacto no sistema:

- Mandatos.
- Orgaos de governanca.
- Cargos configuraveis.
- Decisoes institucionais.
- Aprovações e trilha de auditoria.

## 10. Secretaria Executiva

Caracteristicas esperadas:

- Orgao de administracao e execucao.
- Nomeada pelo Conselho Diretor e referendada pela Assembleia, quando previsto.
- Pode conter Secretario Executivo, Institucional e Administrativo.
- Atua na gerencia administrativa, legal, financeira, comunicacao, captacao e projetos.

Impacto no sistema:

- Orgaos de governanca configuraveis.
- Usuarios e permissoes.
- Segregacao de funcoes.
- Projetos.
- Tesouraria.
- Prestacao de contas.

## 11. Conselho Fiscal

Caracteristicas esperadas:

- Composicao por membros efetivos e suplentes.
- Eleicao simultanea ou vinculada ao processo eleitoral previsto.
- Mandato definido.
- Competencia para fiscalizar contas, atos administrativos e financeiros.
- Pode convocar Assembleia Geral.

Impacto no sistema:

- Conselho Fiscal como orgao configuravel e tambem como base de parecer fiscal.
- Prestacao de contas.
- Parecer fiscal.
- Auditoria.
- Alertas de pendencias.

## 12. Eleicoes e mandatos

Conteudo estatutario esperado:

- Periodicidade das eleicoes.
- Regras de chapas.
- Elegibilidade.
- Reeleicao.
- Duracao dos mandatos.

Impacto no sistema:

- Mandatos.
- Validacao de sobreposicao.
- Historico de diretoria.
- Assembleias eleitorais.
- Atas de eleicao.

## 13. Disposicoes gerais e casos omissos

Conteudo estatutario esperado:

- Regras sobre bens patrimoniais.
- Regimentos especiais.
- Responsabilidade dos associados.
- Solucao de casos omissos.

Impacto no sistema:

- Documentos oficiais.
- Regimentos internos.
- Auditoria.
- Compliance juridico.

## Decisoes ja incorporadas ao sistema

- Categorias de membros ampliadas para fundadores, efetivos, benemeritos, colaboradores e honorarios.
- Orgaos configuraveis ampliados para Assembleia Geral, Conselho Diretor, Diretoria Executiva, Secretaria Executiva, Conselho Fiscal e comites diversos.
- A arquitetura nao limita a entidade a Diretoria Executiva e Conselho Fiscal.
