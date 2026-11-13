import { buildProduct } from '../../support/factories/product.js';
import { buildUser } from '../../support/factories/user.js';

describe('API de carrinhos', () => {
  const apiUrl = Cypress.expose('apiUrl');
  let authorization;
  let createdCartId;
  let createdProductId;
  let createdUserId;

  beforeEach(() => {
    authorization = undefined;
    createdCartId = undefined;
    createdProductId = undefined;
    createdUserId = undefined;
  });

  afterEach(() => {
    if (createdCartId && authorization) {
      cy.cancelCartByApi(authorization);
    }

    if (createdProductId && authorization) {
      cy.deleteProductByApi(createdProductId, authorization);
    }

    if (createdUserId) {
      cy.deleteUserByApi(createdUserId);
    }
  });

  it('[API-010] cria, consulta e cancela um carrinho', () => {
    const adminUser = buildUser({ administrador: 'true' });
    const product = buildProduct();
    const cartQuantity = 2;

    cy.createUserByApi(adminUser).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.loginByApi(adminUser).then((loginResponse) => {
      authorization = loginResponse.body.authorization;

      expect(loginResponse.status).to.eq(200);
      expect(authorization).to.be.a('string').and.not.be.empty;

      cy.createProductByApi(product, authorization).then(({ _id }) => {
        createdProductId = _id;

        cy.log('POST /carrinhos com produto disponível');
        cy.request({
          method: 'POST',
          url: `${apiUrl}/carrinhos`,
          headers: { Authorization: authorization },
          body: {
            produtos: [{ idProduto: createdProductId, quantidade: cartQuantity }],
          },
          log: false,
        }).then((createResponse) => {
          if (createResponse.body._id) {
            createdCartId = createResponse.body._id;
          }

          expect(createResponse.status).to.eq(201);
          expect(createResponse.body).to.have.all.keys('message', '_id');
          expect(createResponse.body.message).to.eq('Cadastro realizado com sucesso');

          cy.request({
            method: 'GET',
            url: `${apiUrl}/carrinhos/${createdCartId}`,
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body).to.deep.equal({
              produtos: [
                {
                  idProduto: createdProductId,
                  quantidade: cartQuantity,
                  precoUnitario: product.preco,
                },
              ],
              precoTotal: product.preco * cartQuantity,
              quantidadeTotal: cartQuantity,
              idUsuario: createdUserId,
              _id: createdCartId,
            });
          });

          cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos/${createdProductId}`,
          })
            .its('body.quantidade')
            .should('eq', product.quantidade - cartQuantity);

          cy.log('DELETE /carrinhos/cancelar-compra');
          cy.request({
            method: 'DELETE',
            url: `${apiUrl}/carrinhos/cancelar-compra`,
            headers: { Authorization: authorization },
            log: false,
          }).then((cancelResponse) => {
            if (
              cancelResponse.body.message ===
              'Registro excluído com sucesso. Estoque dos produtos reabastecido'
            ) {
              createdCartId = undefined;
            }

            expect(cancelResponse.status).to.eq(200);
            expect(cancelResponse.body).to.deep.equal({
              message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido',
            });

            cy.request({
              method: 'GET',
              url: `${apiUrl}/produtos/${createdProductId}`,
            })
              .its('body.quantidade')
              .should('eq', product.quantidade);
          });
        });
      });
    });
  });
});
