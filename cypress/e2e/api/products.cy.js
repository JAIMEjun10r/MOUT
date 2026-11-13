import { buildProduct } from '../../support/factories/product.js';
import { buildUser } from '../../support/factories/user.js';

describe('API de produtos', () => {
  const apiUrl = Cypress.expose('apiUrl');
  let adminUserId;
  let authorization;
  let createdProductId;

  beforeEach(() => {
    adminUserId = undefined;
    authorization = undefined;
    createdProductId = undefined;
  });

  afterEach(() => {
    if (createdProductId && authorization) {
      cy.deleteProductByApi(createdProductId, authorization);
    }

    if (adminUserId) {
      cy.deleteUserByApi(adminUserId);
    }
  });

  it('[API-003] cadastra e consulta um produto como administrador', () => {
    const adminUser = buildUser({ administrador: 'true' });
    const product = buildProduct();

    cy.createUserByApi(adminUser).then(({ _id }) => {
      adminUserId = _id;
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
});
