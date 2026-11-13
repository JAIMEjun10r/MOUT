const getApiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('loginByApi', ({ email, password }) => {
  Cypress.log({ name: 'loginByApi', message: email });

  return cy.request({
    method: 'POST',
    url: `${getApiUrl()}/login`,
    body: { email, password },
    log: false,
  });
});
