# Plano de testes — API

## Escopo inicial

A etapa obrigatória de API cobre três domínios e combina caminhos positivos e negativos:

1. cadastro e consulta de usuário;
2. rejeição de credenciais inválidas;
3. cadastro e consulta de produto autenticado como administrador.

Os testes chamam a API real com `cy.request()` e validam status, cabeçalhos, estrutura e conteúdo das
respostas. Os identificadores `API-001` a `API-003` foram criados porque o documento de origem não
fornece IDs individuais.

## Estratégia de dados e autenticação

- Usuários e produtos recebem dados únicos por execução.
- Senhas e tokens não aparecem no Command Log.
- O token de administrador existe apenas em memória durante o cenário.
- Registros criados são removidos em `afterEach`.
- Produtos são excluídos antes dos usuários para respeitar dependências da API.
- O ambiente é configurável por `CYPRESS_API_URL`, sem URLs espalhadas pelos specs.

## Cobertura dos contratos

- `API-001` valida criação `201`, consulta `200` e persistência integral dos dados do usuário.
- `API-002` valida erro `401`, corpo da resposta e cabeçalhos de segurança.
- `API-003` valida autenticação, autorização administrativa, criação `201` e consulta do produto.
- `API-004` valida a regra de unicidade do e-mail e o contrato de erro `400`.
- `API-005` altera os dados de um usuário e confirma a persistência pelo mesmo identificador.
- `API-006` valida o login bem-sucedido e a estrutura do token Bearer retornado.
- `API-007` valida a rejeição do cadastro de produto sem token de acesso.
- `API-008` valida a autorização ao impedir a operação por usuário não administrador.

## Riscos e decisões

- O ambiente online é público e compartilhado; outro consumidor pode alterar dados simultaneamente.
- Os dados exclusivos reduzem colisões, mas não eliminam indisponibilidade externa.
- Os testes não registram tokens e não dependem de usuários ou produtos preexistentes.
- Vídeos ficam desativados na execução dedicada de API porque specs HTTP não possuem interação visual.
- Não são executados testes de carga, fuzzing ou ações destrutivas fora dos registros criados pela suíte.

## Próximos candidatos de API

- acesso administrativo com token inválido ou expirado;
- edição de produtos;
- carrinho, conclusão e cancelamento de compra;
- consultas com filtros e recursos inexistentes;
- validação ampliada de schemas e cabeçalhos de segurança.
