const getApiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('cancelCartByApi', (authorization) => {
  Cypress.log({ name: 'cancelCartByApi' });

  return cy
    .request({
      method: 'DELETE',
      url: `${getApiUrl()}/carrinhos/cancelar-compra`,
      headers: { Authorization: authorization },
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.be.oneOf([
        'Registro excluído com sucesso',
        'Registro excluído com sucesso. Estoque dos produtos reabastecido',
        'Não foi encontrado carrinho para esse usuário',
      ]);
    });
});

Cypress.Commands.add('cleanupCartResourcesByApi', (resources) => {
  Cypress.log({ name: 'cleanupCartResourcesByApi' });

  return cy
    .wrap(null, { log: false })
    .then(() => {
      if (resources.cartId && resources.authorization) {
        return cy.cancelCartByApi(resources.authorization).then(() => {
          resources.cartId = undefined;
        });
      }
    })
    .then(() => {
      if (resources.productId && resources.authorization) {
        return cy.deleteProductByApi(resources.productId, resources.authorization).then(() => {
          resources.productId = undefined;
        });
      }
    })
    .then(() => {
      if (resources.userId) {
        return cy.deleteUserByApi(resources.userId).then(() => {
          resources.userId = undefined;
        });
      }
    });
});
