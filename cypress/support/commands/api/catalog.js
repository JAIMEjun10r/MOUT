const getApiUrl = () => Cypress.expose('apiUrl');
const isNamePreservedInQuery = (productName) =>
  new URL(`/produtos?nome=${productName}`, getApiUrl()).searchParams.get('nome') === productName;

const getAvailableProduct = (predicate, assertionLabel) => {
  return cy
    .request({
      method: 'GET',
      url: `${getApiUrl()}/produtos`,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200);

      const product = response.body.produtos.find(
        (candidate) => candidate.quantidade > 0 && predicate(candidate),
      );
      expect(product, assertionLabel).to.exist;

      return product;
    });
};

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

  return getAvailableProduct(() => true, 'produto disponível para o cenário');
});

Cypress.Commands.add('getSearchableProductByApi', () => {
  Cypress.log({ name: 'getSearchableProductByApi' });

  return getAvailableProduct(
    ({ nome }) => isNamePreservedInQuery(nome),
    'produto disponível com nome preservado na query string',
  );
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
