import { buildUser } from '../../support/factories/user.js';

describe('API de autenticação', () => {
  const apiUrl = Cypress.expose('apiUrl');
  let createdUserId;

  beforeEach(() => {
    createdUserId = undefined;
  });

  afterEach(() => {
    if (createdUserId) {
      cy.deleteUserByApi(createdUserId);
    }
  });

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

  it('[API-006] autentica um usuário com credenciais válidas', () => {
    const user = buildUser();

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.loginByApi(user).then((response) => {
      const { authorization } = response.body;

      expect(response.status).to.eq(200);
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.have.all.keys('message', 'authorization');
      expect(response.body.message).to.eq('Login realizado com sucesso');
      expect(authorization).to.be.a('string').and.not.be.empty;

      const [scheme, token] = authorization.split(' ');
      expect(scheme).to.eq('Bearer');
      expect(token.split('.')).to.have.length(3);
    });
  });
});
