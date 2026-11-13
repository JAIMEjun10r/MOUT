# Plano de testes — frontend

## Escopo inicial

O ServeRest Front foi analisado como uma aplicação pública de treinamento, integrada à API pública
do ServeRest. A primeira etapa cobre três fluxos distintos e de alto valor:

1. cadastro bem-sucedido de usuário comum;
2. rejeição de credenciais inválidas;
3. pesquisa e adição de um produto à lista de compras.

A cobertura complementar inclui as validações de campos obrigatórios e da regra de unicidade do
e-mail no cadastro de usuário.

Os casos usam os `data-testid` oferecidos pela aplicação, interceptam as requisições antes das ações
e validam resultados de negócio tanto na rede quanto na interface.

## Estratégia de dados

- Usuários recebem nome e e-mail únicos por execução.
- O produto é selecionado dinamicamente entre os itens com estoque disponível.
- Preparação e limpeza reutilizáveis ficam em custom commands de API.
- Fluxos que não testam o login reutilizam uma sessão autenticada criada pela API com `cy.session()`.
- Senhas são geradas localmente, não são segredos e não aparecem no Command Log.
- Cada usuário criado pelos testes é removido ao final do cenário.
- Cenários negativos validam em conjunto o contrato da API, a mensagem exibida e a permanência na
  rota de cadastro.

## Riscos e decisões

- O ambiente online é compartilhado; seus dados podem mudar durante a execução.
- O frontend está identificado pelo próprio projeto como beta.
- Após o cadastro, a aplicação possui uma espera interna de três segundos antes do redirecionamento.
  O teste não replica essa espera: aguarda as requisições e a rota observável.
- Alguns `data-testid` são repetidos nos cards. O teste restringe a busca ao card do produto escolhido.
- Os testes não finalizam compras, não criam carrinhos e não alteram produtos nesta etapa.
- No cadastro vazio, a interface exibe `Password é obrigatório`, combinando o nome do campo em
  inglês com a mensagem em português; o teste preserva o comportamento observado.

## Próximos candidatos de frontend

- pesquisa sem resultados;
- detalhes de produto;
- incremento, decremento e limpeza da lista;
- logout e proteção de rotas;
- fluxo de administrador para cadastro e listagem de produtos.
