import { buildProduct } from '../../support/factories/product.js';
import { buildUser } from '../../support/factories/user.js';

describe('API de carrinhos', () => {
  const apiUrl = Cypress.expose('apiUrl');
  let createdResources;

  beforeEach(() => {
    createdResources = {};
  });

  afterEach(() => {
    cy.cleanupCartResourcesByApi(createdResources);
  });

  it('[API-010] cria, consulta e cancela um carrinho', () => {
    const adminUser = buildUser({ administrador: 'true' });
    const product = buildProduct();
    const cartQuantity = 2;

    cy.createUserByApi(adminUser).then(({ _id: userId }) => {
      createdResources.userId = userId;
    });

    cy.loginByApi(adminUser).then((loginResponse) => {
      const authorization = loginResponse.body.authorization;
      createdResources.authorization = authorization;

      expect(loginResponse.status).to.eq(200);
      expect(authorization).to.be.a('string').and.not.be.empty;

      cy.createProductByApi(product, authorization).then(({ _id: productId }) => {
        createdResources.productId = productId;

        cy.log('POST /carrinhos com produto disponível');
        cy.request({
          method: 'POST',
          url: `${apiUrl}/carrinhos`,
          headers: { Authorization: authorization },
          body: {
            produtos: [{ idProduto: productId, quantidade: cartQuantity }],
          },
          log: false,
        }).then((createResponse) => {
          const cartId = createResponse.body._id;
          createdResources.cartId = cartId;

          expect(createResponse.status).to.eq(201);
          expect(createResponse.body).to.have.all.keys('message', '_id');
          expect(createResponse.body.message).to.eq('Cadastro realizado com sucesso');

          cy.request({
            method: 'GET',
            url: `${apiUrl}/carrinhos/${cartId}`,
          }).then((getResponse) => {
            expect(getResponse.status).to.eq(200);
            expect(getResponse.body).to.deep.equal({
              produtos: [
                {
                  idProduto: productId,
                  quantidade: cartQuantity,
                  precoUnitario: product.preco,
                },
              ],
              precoTotal: product.preco * cartQuantity,
              quantidadeTotal: cartQuantity,
              idUsuario: createdResources.userId,
              _id: cartId,
            });
          });

          cy.request({
            method: 'GET',
            url: `${apiUrl}/produtos/${productId}`,
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
            expect(cancelResponse.status).to.eq(200);
            expect(cancelResponse.body).to.deep.equal({
              message: 'Registro excluído com sucesso. Estoque dos produtos reabastecido',
            });
            createdResources.cartId = undefined;

            cy.request({
              method: 'GET',
              url: `${apiUrl}/produtos/${productId}`,
            })
              .its('body.quantidade')
              .should('eq', product.quantidade);
          });
        });
      });
    });

    cy.cleanupCartResourcesByApi(createdResources);
  });
});
