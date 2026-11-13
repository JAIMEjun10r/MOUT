# Rastreabilidade dos testes

O documento de origem não fornece IDs individuais. Os identificadores abaixo foram criados para
manter rastreabilidade estável entre estratégia, specs e resultados.

| Caso          | Fonte                                     | Spec/teste                                         | Status    | Observações                                                                                          |
| ------------- | ----------------------------------------- | -------------------------------------------------- | --------- | ---------------------------------------------------------------------------------------------------- |
| FRONT-E2E-001 | `Senior QA Test (1).pdf`, p. 1 — frontend | `authentication.cy.js` — cadastro de usuário comum | automated | Cria dados únicos pela UI, valida contrato observado e remove o usuário pela API.                    |
| FRONT-E2E-002 | `Senior QA Test (1).pdf`, p. 1 — frontend | `authentication.cy.js` — login inválido            | automated | Não altera dados remotos; valida status, mensagem e permanência na rota.                             |
| FRONT-E2E-003 | `Senior QA Test (1).pdf`, p. 1 — frontend | `catalog.cy.js` — busca e lista de compras         | automated | Prepara usuário pela API, reutiliza sessão autenticada, escolhe produto disponível e limpa os dados. |
| API-001       | `Senior QA Test (1).pdf`, p. 1 — API      | `users.cy.js` — cadastro e consulta de usuário     | automated | Cria dados únicos, valida os contratos de criação e consulta e remove o registro ao final.           |
| API-002       | `Senior QA Test (1).pdf`, p. 1 — API      | `authentication.cy.js` — login inválido            | automated | Valida o contrato de erro, os cabeçalhos de segurança e evita registrar a senha no Command Log.      |
| API-003       | `Senior QA Test (1).pdf`, p. 1 — API      | `products.cy.js` — cadastro e consulta de produto  | automated | Autentica um administrador, valida criação e consulta e remove produto e usuário na ordem correta.   |
| API-004       | Swagger ServeRest — `POST /usuarios`      | `users.cy.js` — e-mail duplicado                   | automated | Cria a pré-condição, valida o erro de duplicidade e remove o usuário original ao final.              |
| API-005       | Swagger ServeRest — `PUT /usuarios/{_id}` | `users.cy.js` — edição e consulta de usuário       | automated | Altera todos os campos, consulta o mesmo ID e compara integralmente os dados persistidos.            |
| API-006       | Swagger ServeRest — `POST /login`         | `authentication.cy.js` — login válido              | automated | Cria um usuário, valida mensagem e estrutura do token Bearer e remove a pré-condição ao final.       |
| API-007       | Swagger ServeRest — `POST /produtos`      | `products.cy.js` — cadastro sem token              | automated | Valida que a API rejeita a criação sem credencial e não deixa dados para limpeza.                    |
| API-008       | Swagger ServeRest — `POST /produtos`      | `products.cy.js` — usuário comum                   | automated | Autentica um usuário não administrador, valida a proibição e remove a pré-condição.                  |

## Estados possíveis

- `automated`: passos e resultados essenciais estão cobertos e executáveis.
- `partial`: apenas parte do comportamento foi automatizada.
- `blocked`: falta dado, acesso ou comportamento necessário.
- `duplicate`: cenário equivalente já está representado por outro caso.
- `out-of-scope`: reservado para uma etapa posterior acordada.
