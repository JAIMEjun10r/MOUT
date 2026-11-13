import { buildUser } from '../../support/factories/user.js';

describe('API de usuários', () => {
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

  it('[API-001] cadastra e consulta um usuário', () => {
    const user = buildUser();

    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: user,
    }).then((createResponse) => {
      if (createResponse.body._id) {
        createdUserId = createResponse.body._id;
      }

      expect(createResponse.status).to.eq(201);
      expect(createResponse.headers['content-type']).to.include('application/json');
      expect(createResponse.body).to.have.all.keys('message', '_id');
      expect(createResponse.body.message).to.eq('Cadastro realizado com sucesso');
      expect(createResponse.body._id).to.be.a('string').and.not.be.empty;

      cy.request({
        method: 'GET',
        url: `${apiUrl}/usuarios/${createdUserId}`,
      }).then((getResponse) => {
        expect(getResponse.status).to.eq(200);
        expect(getResponse.headers['content-type']).to.include('application/json');
        expect(getResponse.body).to.deep.equal({
          ...user,
          _id: createdUserId,
        });
      });
    });
  });
});
