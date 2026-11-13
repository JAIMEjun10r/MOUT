import { buildUser } from '../../support/factories/user.js';

describe('Catálogo de produtos', () => {
  let createdUserId;

  beforeEach(() => {
    createdUserId = undefined;
  });

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

    cy.getSearchableProductByApi().then((product) => {
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

  it('[FRONT-E2E-006] informa quando a pesquisa não encontra produtos', () => {
    const user = buildUser();
    const unknownProductName = `Produto inexistente ${crypto.randomUUID().slice(0, 8)}`;

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.intercept('GET', '**/produtos').as('loadProducts');
    cy.intercept('GET', '**/produtos?nome=*').as('searchProducts');

    cy.loginWithSession(user);
    cy.visit('/home');

    cy.location('pathname').should('eq', '/home');
    cy.wait('@loadProducts').its('response.statusCode').should('eq', 200);

    cy.searchProductByUi(unknownProductName);

    cy.wait('@searchProducts').then(({ request, response }) => {
      expect(request.query.nome).to.eq(unknownProductName);
      expect(response.statusCode).to.eq(200);
      expect(response.body.quantidade).to.eq(0);
      expect(response.body.produtos).to.deep.equal([]);
    });

    cy.contains('p', 'Nenhum produto foi encontrado').should('be.visible');
  });

  it('[FRONT-E2E-007] exibe os detalhes do produto selecionado', () => {
    const user = buildUser();

    cy.createUserByApi(user).then(({ _id }) => {
      createdUserId = _id;
    });

    cy.getAvailableProductByApi().then((product) => {
      cy.intercept('GET', '**/produtos').as('loadProducts');

      cy.loginWithSession(user);
      cy.visit('/home');

      cy.location('pathname').should('eq', '/home');
      cy.wait('@loadProducts').its('response.statusCode').should('eq', 200);

      cy.openProductDetailsByUi(product.nome);

      cy.location('pathname').should('eq', `/detalhesProduto/${product._id}`);
      cy.contains('h1', 'Detalhes do produto').should('be.visible');
      cy.get('[data-testid="product-detail-name"]')
        .should('be.visible')
        .and('have.text', product.nome);
      cy.contains('h4', 'R$:').should('have.text', `R$: ${product.preco}`);
      cy.contains('h4', 'Quantidade:').should('have.text', `Quantidade: ${product.quantidade}`);
      cy.contains('h4', 'Descrição:').should('have.text', `Descrição: ${product.descricao}`);
    });
  });
});
