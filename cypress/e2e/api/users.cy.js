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

  it('[API-004] impede o cadastro com e-mail duplicado', () => {
    const user = buildUser();

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.log('POST /usuarios com e-mail já cadastrado');
    cy.request({
      method: 'POST',
      url: `${apiUrl}/usuarios`,
      body: user,
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      expect(response.status).to.eq(400);
      expect(response.isOkStatusCode).to.be.false;
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.deep.equal({
        message: 'Este email já está sendo usado',
      });
    });
  });

  it('[API-005] edita e consulta um usuário', () => {
    const originalUser = buildUser();
    const updatedUser = buildUser();

    cy.createUserByApi(originalUser).then(({ _id }) => {
      createdUserId = _id;

      cy.log('PUT /usuarios/{_id} com novos dados');
      cy.request({
        method: 'PUT',
        url: `${apiUrl}/usuarios/${createdUserId}`,
        body: updatedUser,
        log: false,
      }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.headers['content-type']).to.include('application/json');
        expect(updateResponse.body).to.deep.equal({
          message: 'Registro alterado com sucesso',
        });

        cy.request({
          method: 'GET',
          url: `${apiUrl}/usuarios/${createdUserId}`,
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.body).to.deep.equal({
            ...updatedUser,
            _id: createdUserId,
          });
        });
      });
    });
  });
});
