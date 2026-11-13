const byTestId = (testId) => `[data-testid="${testId}"]`;

Cypress.Commands.add('searchProductByUi', (productName) => {
  cy.get(byTestId('pesquisar')).clear();
  cy.get(byTestId('pesquisar')).type(productName);
  cy.get(byTestId('botaoPesquisar')).click();
});

Cypress.Commands.add('addProductToListByUi', (productName) => {
  cy.contains('.card-title', productName)
    .parents('.card')
    .within(() => {
      cy.get(byTestId('adicionarNaLista')).click();
    });
});
