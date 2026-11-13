const getApiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('createProductByApi', (product, authorization) => {
  Cypress.log({ name: 'createProductByApi', message: product.nome });

  return cy
    .request({
      method: 'POST',
      url: `${getApiUrl()}/produtos`,
      headers: { Authorization: authorization },
      body: product,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id').and.not.be.empty;

      return response.body;
    });
});

Cypress.Commands.add('getAvailableProductByApi', () => {
  Cypress.log({ name: 'getAvailableProductByApi' });

  return cy
    .request({
      method: 'GET',
      url: `${getApiUrl()}/produtos`,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const product = response.body.produtos.find(({ quantidade }) => quantidade > 0);
      expect(product, 'produto disponível para o cenário').to.exist;

      return product;
    });
});

Cypress.Commands.add('deleteProductByApi', (productId, authorization) => {
  Cypress.log({ name: 'deleteProductByApi', message: productId });

  return cy
    .request({
      method: 'DELETE',
      url: `${getApiUrl()}/produtos/${productId}`,
      headers: { Authorization: authorization },
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
    });
});
