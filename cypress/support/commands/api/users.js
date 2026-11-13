const getApiUrl = () => Cypress.expose('apiUrl');

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
