export const buildProduct = (overrides = {}) => {
  const uniqueId = crypto.randomUUID().slice(0, 8);

  return {
    nome: `Produto QA ${uniqueId}`,
    preco: 129,
    descricao: `Produto criado pelo cenário ${uniqueId}`,
    quantidade: 5,
    ...overrides,
  };
};
