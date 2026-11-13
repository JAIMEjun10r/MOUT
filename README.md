# ServeRest — testes com Cypress

Projeto de automação em JavaScript para o [ServeRest Front](https://front.serverest.dev/) e a
[API ServeRest](https://serverest.dev/). A etapa atual implementa os três cenários obrigatórios de
frontend; os cenários de API serão adicionados na próxima etapa.

## Cenários de frontend

- `FRONT-E2E-001`: cadastro de usuário comum e acesso à loja;
- `FRONT-E2E-002`: rejeição de credenciais inválidas;
- `FRONT-E2E-003`: pesquisa de produto e adição à lista de compras.

A matriz completa está em [docs/test-traceability.md](docs/test-traceability.md) e as decisões de
cobertura estão em [docs/frontend-test-plan.md](docs/frontend-test-plan.md).

## Pré-requisitos

- Node.js compatível com a faixa declarada em `package.json`;
- npm;
- Chrome para a execução headless padrão; Edge também pode ser escolhido no modo interativo.

## Instalação e execução

```bash
npm ci
npm run cy:open
```

Para executar somente os testes de frontend em modo headless:

```bash
npm run cy:run:front
```

Para validar qualidade e executar a suíte atual:

```bash
npm test
```

## Ambientes

Os alvos padrão são o frontend e a API públicos do ServeRest. Eles podem ser substituídos sem alterar
o código:

```bash
CYPRESS_BASE_URL=https://front.example.test \
CYPRESS_API_URL=https://api.example.test \
npm run cy:run:front
```

No PowerShell, defina as mesmas variáveis com `$env:CYPRESS_BASE_URL` e `$env:CYPRESS_API_URL`.

## Estrutura

```text
cypress/
├── e2e/frontend/          # specs por domínio
└── support/
    ├── commands/          # ações de negócio e preparação por API
    └── factories/         # dados únicos por execução
docs/                      # plano e rastreabilidade
```

Os testes usam seletores estáveis da aplicação, esperas orientadas por rede/estado, dados isolados e
limpeza dos registros criados. Fluxos que apenas dependem de autenticação reutilizam `cy.session()`;
o login pela interface permanece nos cenários que validam esse comportamento. Nenhuma credencial ou
token é versionado.
