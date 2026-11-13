export const buildUser = (overrides = {}) => {
  const uniqueId = crypto.randomUUID().slice(0, 8);

  return {
    nome: `QA Senior ${uniqueId}`,
    email: `qa.senior.${uniqueId}@example.com`,
    password: `Teste@${uniqueId}`,
    administrador: 'false',
    ...overrides,
  };
};
