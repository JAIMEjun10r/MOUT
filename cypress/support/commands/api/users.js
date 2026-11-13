const getApiUrl = () => Cypress.expose('apiUrl');

Cypress.Commands.add('createUserByApi', (user) => {
  Cypress.log({ name: 'createUserByApi', message: user.email });

  return cy
    .request({
      method: 'POST',
      url: `${getApiUrl()}/usuarios`,
      body: user,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id').and.not.be.empty;

      return response.body;
    });
});

Cypress.Commands.add('deleteUserByApi', (userId) => {
  Cypress.log({ name: 'deleteUserByApi', message: userId });

  return cy
    .request({
      method: 'DELETE',
      url: `${getApiUrl()}/usuarios/${userId}`,
      log: false,
    })
    .then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.message).to.eq('Registro excluído com sucesso');
    });
});
