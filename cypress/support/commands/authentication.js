const byTestId = (testId) => `[data-testid="${testId}"]`;

Cypress.Commands.add('openUserRegistrationByUi', () => {
  cy.visit('/login');
  cy.get(byTestId('cadastrar')).click();
  cy.location('pathname').should('eq', '/cadastrarusuarios');
});

Cypress.Commands.add('submitUserRegistrationByUi', (user = {}) => {
  if (user.nome) {
    cy.get(byTestId('nome')).type(user.nome);
  }

  if (user.email) {
    cy.get(byTestId('email')).type(user.email);
  }

  if (user.password) {
    cy.get(byTestId('password')).type(user.password, { log: false });
  }

  if (user.administrador === 'true') {
    cy.get(byTestId('checkbox')).check();
  }

  cy.get(byTestId('cadastrar')).click();
});

Cypress.Commands.add('registerUserByUi', (user) => {
  cy.openUserRegistrationByUi();
  cy.submitUserRegistrationByUi(user);
});

Cypress.Commands.add('loginByUi', ({ email, password }) => {
  cy.visit('/login');
  cy.get(byTestId('email')).type(email);
  cy.get(byTestId('senha')).type(password, { log: false });
  cy.get(byTestId('entrar')).click();
});

Cypress.Commands.add('loginWithSession', ({ email, password, nome, administrador }) => {
  cy.session(
    ['serverest', email, administrador],
    () => {
      cy.loginByApi({ email, password }).then(({ status, body }) => {
        expect(status).to.eq(200);
        expect(body.authorization).to.be.a('string').and.not.be.empty;

        cy.visit('/login', {
          onBeforeLoad(window) {
            window.localStorage.setItem('serverest/userEmail', email);
            window.localStorage.setItem('serverest/userToken', body.authorization);
            window.localStorage.setItem('serverest/userNome', nome);
          },
        });
      });
    },
    {
      validate() {
        cy.getAllLocalStorage().should((storageByOrigin) => {
          const appStorage = Object.values(storageByOrigin).find((storage) =>
            Object.hasOwn(storage, 'serverest/userToken'),
          );

          expect(appStorage, 'armazenamento da aplicação').to.exist;
          expect(appStorage['serverest/userEmail']).to.eq(email);
          expect(appStorage['serverest/userToken']).to.be.a('string').and.not.be.empty;
        });
      },
    },
  );
});
