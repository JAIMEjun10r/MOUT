const byTestId = (testId) => `[data-testid="${testId}"]`;
const getProductCardByName = (productName) =>
  cy.contains('.card-title', productName).parents('.card');

Cypress.Commands.add('searchProductByUi', (productName) => {
  cy.get(byTestId('pesquisar')).clear();
  cy.get(byTestId('pesquisar')).type(productName);
  cy.get(byTestId('botaoPesquisar')).click();
});

Cypress.Commands.add('addProductToListByUi', (productName) => {
  getProductCardByName(productName).within(() => {
    cy.get(byTestId('adicionarNaLista')).click();
  });
});

Cypress.Commands.add('openProductDetailsByUi', (productName) => {
  getProductCardByName(productName).within(() => {
    cy.contains(byTestId('product-detail-link'), 'Detalhes').click();
  });
});
