import { buildUser } from '../../support/factories/user.js';

describe('API de autenticação', () => {
  const apiUrl = Cypress.expose('apiUrl');

  it('[API-002] rejeita credenciais inválidas', () => {
    const { email, password } = buildUser();

    cy.log('POST /login com credenciais inválidas');
    cy.request({
      method: 'POST',
      url: `${apiUrl}/login`,
      body: { email, password },
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.isOkStatusCode).to.be.false;
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.headers['x-content-type-options']).to.eq('nosniff');
      expect(response.headers).not.to.have.property('x-powered-by');
      expect(response.body).to.deep.equal({
        message: 'Email e/ou senha inválidos',
      });
    });
  });
});
