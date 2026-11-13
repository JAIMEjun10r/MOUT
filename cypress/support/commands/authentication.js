const byTestId = (testId) => `[data-testid="${testId}"]`;

Cypress.Commands.add('registerUserByUi', (user) => {
  cy.visit('/login');
  cy.get(byTestId('cadastrar')).click();
  cy.location('pathname').should('eq', '/cadastrarusuarios');

  cy.get(byTestId('nome')).type(user.nome);
  cy.get(byTestId('email')).type(user.email);
  cy.get(byTestId('password')).type(user.password, { log: false });

  if (user.administrador === 'true') {
    cy.get(byTestId('checkbox')).check();
  }

  cy.get(byTestId('cadastrar')).click();
});

Cypress.Commands.add('loginByUi', ({ email, password }) => {
  cy.visit('/login');
  cy.get(byTestId('email')).type(email);
  cy.get(byTestId('senha')).type(password, { log: false });
  cy.get(byTestId('entrar')).click();
});
