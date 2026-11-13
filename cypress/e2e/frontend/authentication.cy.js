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

  it('[FRONT-E2E-002] mantém o usuário no login quando as credenciais são inválidas', () => {
    const invalidCredentials = buildUser();

    cy.intercept('POST', '**/login').as('invalidLogin');

    cy.loginByUi(invalidCredentials);

    cy.wait('@invalidLogin').then(({ request, response }) => {
      expect(request.body).to.deep.equal({
        email: invalidCredentials.email,
        password: invalidCredentials.password,
      });
      expect(response.statusCode).to.eq(401);
      expect(response.body.message).to.eq('Email e/ou senha inválidos');
    });

    cy.location('pathname').should('eq', '/login');
    cy.get('[role="alert"]').should('be.visible').and('contain', 'Email e/ou senha inválidos');
  });

  it('[FRONT-E2E-004] informa os campos obrigatórios no cadastro', () => {
    cy.intercept('POST', '**/usuarios').as('invalidRegistration');

    cy.openUserRegistrationByUi();
    cy.submitUserRegistrationByUi();

    cy.wait('@invalidRegistration').then(({ request, response }) => {
      expect(request.body).to.deep.equal({ administrador: 'false' });
      expect(response.statusCode).to.eq(400);
      expect(response.body).to.deep.equal({
        nome: 'nome é obrigatório',
        email: 'email é obrigatório',
        password: 'password é obrigatório',
      });
    });

    cy.location('pathname').should('eq', '/cadastrarusuarios');
    cy.get('[role="alert"]').should('have.length', 3);
    cy.contains('[role="alert"]', 'Nome é obrigatório').should('be.visible');
    cy.contains('[role="alert"]', 'Email é obrigatório').should('be.visible');
    cy.contains('[role="alert"]', 'Password é obrigatório').should('be.visible');
  });

  it('[FRONT-E2E-005] impede o cadastro com e-mail já utilizado', () => {
    const existingUser = buildUser();

    cy.createUserByApi(existingUser).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.intercept('POST', '**/usuarios').as('duplicateRegistration');

    cy.registerUserByUi(existingUser);

    cy.wait('@duplicateRegistration').then(({ request, response }) => {
      expect(request.body).to.deep.equal(existingUser);
      expect(response.statusCode).to.eq(400);
      expect(response.body).to.deep.equal({
        message: 'Este email já está sendo usado',
      });
    });

    cy.location('pathname').should('eq', '/cadastrarusuarios');
    cy.get('[role="alert"]').should('be.visible').and('contain', 'Este email já está sendo usado');
  });

  it('[FRONT-E2E-008] encerra a sessão e protege a rota da loja', () => {
    const user = buildUser();

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.intercept('GET', '**/produtos').as('loadProducts');

    cy.loginWithSession(user);
    cy.visit('/home');

    cy.location('pathname').should('eq', '/home');
    cy.wait('@loadProducts').its('response.statusCode').should('eq', 200);
    cy.contains('h1', 'Serverest Store').should('be.visible');

    cy.logoutByUi();

    cy.location('pathname').should('eq', '/login');
    cy.window().should((window) => {
      expect(window.localStorage.getItem('serverest/userEmail')).to.be.null;
      expect(window.localStorage.getItem('serverest/userToken')).to.be.null;
      expect(window.localStorage.getItem('serverest/userNome')).to.be.null;
    });

    cy.visit('/home');

    cy.location('pathname').should('eq', '/login');
    cy.contains('h1', 'Serverest Store').should('not.exist');
  });
});
