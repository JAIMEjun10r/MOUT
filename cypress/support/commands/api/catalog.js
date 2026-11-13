const getApiUrl = () => Cypress.expose('apiUrl');

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
