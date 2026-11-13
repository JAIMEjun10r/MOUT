# Rastreabilidade dos testes

O documento de origem não fornece IDs individuais. Os identificadores abaixo foram criados para
manter rastreabilidade estável entre estratégia, specs e resultados.

| Caso          | Fonte                                     | Spec/teste                                         | Status       | Observações                                                                                          |
| ------------- | ----------------------------------------- | -------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- |
| FRONT-E2E-001 | `Senior QA Test (1).pdf`, p. 1 — frontend | `authentication.cy.js` — cadastro de usuário comum | automated    | Cria dados únicos pela UI, valida contrato observado e remove o usuário pela API.                    |
| FRONT-E2E-002 | `Senior QA Test (1).pdf`, p. 1 — frontend | `authentication.cy.js` — login inválido            | automated    | Não altera dados remotos; valida status, mensagem e permanência na rota.                             |
| FRONT-E2E-003 | `Senior QA Test (1).pdf`, p. 1 — frontend | `catalog.cy.js` — busca e lista de compras         | automated    | Prepara usuário pela API, reutiliza sessão autenticada, escolhe produto disponível e limpa os dados. |
| API-*         | `Senior QA Test (1).pdf`, p. 1 — API      | A definir na segunda etapa                         | out-of-scope | Os três cenários obrigatórios de API serão desenhados depois da entrega inicial de frontend.         |

## Estados possíveis

- `automated`: passos e resultados essenciais estão cobertos e executáveis.
- `partial`: apenas parte do comportamento foi automatizada.
- `blocked`: falta dado, acesso ou comportamento necessário.
- `duplicate`: cenário equivalente já está representado por outro caso.
- `out-of-scope`: reservado para uma etapa posterior acordada.
