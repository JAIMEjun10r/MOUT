import { buildProduct } from '../../support/factories/product.js';
import { buildUser } from '../../support/factories/user.js';

describe('API de produtos', () => {
  const apiUrl = Cypress.expose('apiUrl');
  let createdUserId;
  let authorization;
  let createdProductId;

  beforeEach(() => {
    createdUserId = undefined;
    authorization = undefined;
    createdProductId = undefined;
  });

  afterEach(() => {
    if (createdProductId && authorization) {
      cy.deleteProductByApi(createdProductId, authorization);
    }

    if (createdUserId) {
      cy.deleteUserByApi(createdUserId);
    }
  });

  it('[API-003] cadastra e consulta um produto como administrador', () => {
    const adminUser = buildUser({ administrador: 'true' });
    const product = buildProduct();

    cy.createUserByApi(adminUser).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.loginByApi(adminUser).then((loginResponse) => {
      authorization = loginResponse.body.authorization;

      expect(loginResponse.status).to.eq(200);
      expect(loginResponse.body).to.have.all.keys('message', 'authorization');
      expect(loginResponse.body.message).to.eq('Login realizado com sucesso');
      expect(authorization).to.be.a('string').and.not.be.empty;

      cy.log('POST /produtos como administrador');
      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        headers: { Authorization: authorization },
        body: product,
        log: false,
      }).then((createResponse) => {
        if (createResponse.body._id) {
          createdProductId = createResponse.body._id;
        }

        expect(createResponse.status).to.eq(201);
        expect(createResponse.headers['content-type']).to.include('application/json');
        expect(createResponse.body).to.have.all.keys('message', '_id');
        expect(createResponse.body.message).to.eq('Cadastro realizado com sucesso');
        expect(createResponse.body._id).to.be.a('string').and.not.be.empty;

        cy.request({
          method: 'GET',
          url: `${apiUrl}/produtos/${createdProductId}`,
        }).then((getResponse) => {
          expect(getResponse.status).to.eq(200);
          expect(getResponse.headers['content-type']).to.include('application/json');
          expect(getResponse.body).to.deep.equal({
            ...product,
            _id: createdProductId,
          });
        });
      });
    });
  });

  it('[API-007] impede o cadastro de produto sem token', () => {
    const product = buildProduct();

    cy.log('POST /produtos sem token de acesso');
    cy.request({
      method: 'POST',
      url: `${apiUrl}/produtos`,
      body: product,
      failOnStatusCode: false,
      log: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
      expect(response.isOkStatusCode).to.be.false;
      expect(response.headers['content-type']).to.include('application/json');
      expect(response.body).to.deep.equal({
        message: 'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
      });
    });
  });

  it('[API-008] impede o cadastro de produto por usuário comum', () => {
    const regularUser = buildUser();
    const product = buildProduct();

    cy.createUserByApi(regularUser).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.loginByApi(regularUser).then((loginResponse) => {
      authorization = loginResponse.body.authorization;

      expect(loginResponse.status).to.eq(200);
      expect(authorization).to.be.a('string').and.not.be.empty;

      cy.log('POST /produtos como usuário não administrador');
      cy.request({
        method: 'POST',
        url: `${apiUrl}/produtos`,
        headers: { Authorization: authorization },
        body: product,
        failOnStatusCode: false,
        log: false,
      }).then((response) => {
        expect(response.status).to.eq(403);
        expect(response.isOkStatusCode).to.be.false;
        expect(response.headers['content-type']).to.include('application/json');
        expect(response.body).to.deep.equal({
          message: 'Rota exclusiva para administradores',
        });
      });
    });
  });
});
