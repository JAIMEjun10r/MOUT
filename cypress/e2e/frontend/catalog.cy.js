import { buildUser } from '../../support/factories/user.js';

describe('Catálogo de produtos', () => {
  let createdUserId;

  afterEach(() => {
    if (createdUserId) {
      cy.deleteUserByApi(createdUserId);
    }
  });

  it('[FRONT-E2E-003] pesquisa um produto e o adiciona à lista de compras', () => {
    const user = buildUser();

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.getAvailableProductByApi().then((product) => {
      cy.intercept('GET', '**/produtos').as('loadProducts');
      cy.intercept('GET', '**/produtos?nome=*').as('searchProducts');

      cy.loginWithSession(user);
      cy.visit('/home');

      cy.location('pathname').should('eq', '/home');
      cy.wait('@loadProducts').its('response.statusCode').should('eq', 200);

      cy.searchProductByUi(product.nome);

      cy.wait('@searchProducts').then(({ request, response }) => {
        expect(request.query.nome).to.eq(product.nome);
        expect(response.statusCode).to.eq(200);
        expect(response.body.produtos.map(({ _id }) => _id)).to.include(product._id);
      });

      cy.addProductToListByUi(product.nome);

      cy.location('pathname').should('eq', '/minhaListaDeProdutos');
      cy.get('[data-testid="shopping-cart-product-name"]')
        .should('be.visible')
        .and('contain', product.nome);
      cy.get('[data-testid="shopping-cart-product-quantity"]')
        .should('be.visible')
        .and('contain', 'Total: 1');
    });
  });
});
