import { buildUser } from '../../support/factories/user.js';

describe('Autenticação de usuário', () => {
  let createdUserId;

  beforeEach(() => {
    createdUserId = undefined;
  });

  afterEach(() => {
    if (createdUserId) {
      cy.deleteUserByApi(createdUserId);
    }
  });

  it('[FRONT-E2E-001] cadastra um usuário comum e acessa a loja', () => {
    const user = buildUser();

    cy.intercept('POST', '**/usuarios').as('registerUser');
    cy.intercept('POST', '**/login').as('automaticLogin');
    cy.intercept('GET', '**/usuarios').as('validateProfile');

    cy.registerUserByUi(user);

    cy.wait('@registerUser').then(({ request, response }) => {
      expect(request.body).to.deep.equal(user);
      expect(response.statusCode).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
      expect(response.body).to.have.property('_id').and.not.be.empty;

      createdUserId = response.body._id;
    });

    cy.wait('@automaticLogin').its('response.statusCode').should('eq', 200);
    cy.wait('@validateProfile').its('response.statusCode').should('eq', 200);
    cy.location('pathname').should('eq', '/home');
    cy.contains('h1', 'Serverest Store').should('be.visible');
  });
});
