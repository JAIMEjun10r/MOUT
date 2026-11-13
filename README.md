# ServeRest — testes com Cypress

[![Qualidade e testes](https://github.com/JAIMEjun10r/MOUT/actions/workflows/quality.yml/badge.svg)](https://github.com/JAIMEjun10r/MOUT/actions/workflows/quality.yml)

Projeto de automação em JavaScript para o [ServeRest Front](https://front.serverest.dev/) e a
[API ServeRest](https://serverest.dev/). A suíte foi criada a partir de um teste técnico que solicita
três cenários de frontend e três de API, mas amplia a cobertura para 18 testes independentes e
rastreáveis.

## Cobertura

| Camada   | Quantidade | Identificadores                   |
| -------- | ---------- | --------------------------------- |
| Frontend | 8          | `FRONT-E2E-001` a `FRONT-E2E-008` |
| API      | 10         | `API-001` a `API-010`             |
| Total    | 18         | Matriz completa em `docs/`        |

### Frontend

- cadastro de usuário comum e acesso à loja;
- rejeição de credenciais inválidas;
- pesquisa de produto e adição à lista de compras;
- validação dos campos obrigatórios no cadastro;
- bloqueio de cadastro com e-mail já utilizado;
- pesquisa sem resultados;
- visualização dos detalhes do produto;
- logout, limpeza da sessão e proteção da rota da loja.

### API

- cadastro, consulta e edição de usuários;
- bloqueio de e-mail duplicado;
- login válido e inválido;
- cadastro e consulta de produto como administrador;
- rejeição de produto sem token ou por usuário comum;
- bloqueio de produto com nome duplicado;
- criação, consulta e cancelamento de carrinho com validação do estoque.

A relação entre fonte, caso, spec e resultado esperado está na
[matriz de rastreabilidade](docs/test-traceability.md). As decisões de cobertura e os riscos do
ambiente público estão nos planos de [frontend](docs/frontend-test-plan.md) e
[API](docs/api-test-plan.md).

## Decisão arquitetural: commands em vez de Page Objects

O projeto não utiliza o Page Object Model clássico. Essa foi uma decisão consciente para uma suíte
Cypress criada do zero, e não uma limitação da ferramenta.

As [boas práticas oficiais do Cypress](https://docs.cypress.io/app/core-concepts/best-practices)
classificam o compartilhamento de Page Objects como antipadrão. Além disso, a documentação de
[custom commands](https://docs.cypress.io/api/cypress-api/custom-commands#Best-Practices) recomenda
criar abstrações somente para comportamentos reutilizáveis e evitar encapsular cada interação em uma
camada desnecessária.

Por isso, a arquitetura adotada segue estes princípios:

- commands representam ações de negócio, autenticação, preparação e limpeza por API;
- commands são agrupados por domínio, como autenticação, catálogo, usuários, produtos e carrinhos;
- specs mantêm os passos relevantes e as assertivas de negócio visíveis;
- seletores repetidos ficam próximos das ações que os utilizam;
- factories puras geram dados únicos sem depender da interface;
- `cy.session()` reutiliza autenticação sem repetir o login pela UI;
- interações simples e usadas uma única vez permanecem no spec, evitando abstração excessiva.

Esse formato reduz estado em classes, mantém o encadeamento assíncrono e a retentativa nativa do
Cypress visíveis e facilita o diagnóstico de falhas pelo Command Log. Em um repositório que já
possuísse um Page Object Model consistente, a arquitetura existente deveria ser avaliada e
preservada; neste projeto novo, commands por domínio formam a solução menor e mais coerente.

## Estratégia de automação

- dados únicos são criados localmente por execução;
- pré-condições são preparadas por API quando o comportamento testado não é o cadastro pela UI;
- registros criados são removidos respeitando suas dependências;
- tokens e senhas não são gravados em fixtures, logs ou no repositório;
- seletores `data-testid` são priorizados, seguidos por seletores semânticos e escopo por componente;
- sincronização usa requisições interceptadas, rotas e estados observáveis, sem esperas fixas;
- frontend e API podem apontar para outros ambientes por variáveis de ambiente.

## Pré-requisitos

- Node.js compatível com a faixa declarada em `package.json`;
- npm;
- Chrome para a execução headless padrão.

## Instalação

```bash
npm ci
```

## Execução

| Comando                | Finalidade                                  |
| ---------------------- | ------------------------------------------- |
| `npm run cy:open`      | Abre o Cypress em modo interativo           |
| `npm run cy:run:front` | Executa somente os testes de frontend       |
| `npm run cy:run:api`   | Executa somente os testes de API, sem vídeo |
| `npm run lint`         | Verifica as regras do ESLint                |
| `npm run format:check` | Verifica a formatação com Prettier          |
| `npm test`             | Executa qualidade e todos os 18 testes      |

## Ambientes

Os alvos padrão são os ambientes públicos do ServeRest. Eles podem ser substituídos sem alterar o
código:

```bash
CYPRESS_BASE_URL=https://front.example.test \
CYPRESS_API_URL=https://api.example.test \
npm test
```

No PowerShell:

```powershell
$env:CYPRESS_BASE_URL = 'https://front.example.test'
$env:CYPRESS_API_URL = 'https://api.example.test'
npm test
```

## Integração contínua

O workflow [Qualidade e testes](.github/workflows/quality.yml) executa `npm test` em pushes para
`main`, pull requests e acionamentos manuais. As actions são fixadas por SHA, o token possui somente
permissão de leitura e execuções antigas da mesma referência são canceladas.

Quando ocorre uma falha, screenshots e vídeos do Cypress são publicados como artefatos por sete
dias. A pipeline usa os mesmos comandos disponíveis localmente, reduzindo diferenças entre o
ambiente do desenvolvedor e o CI.

## Estrutura

```text
.
├── .github/workflows/       # pipeline de qualidade e testes
├── cypress/
│   ├── e2e/
│   │   ├── api/             # autenticação, usuários, produtos e carrinhos
│   │   └── frontend/        # autenticação e catálogo
│   └── support/
│       ├── commands/        # commands de UI e API agrupados por domínio
│       └── factories/       # geração de dados únicos
├── docs/                    # planos e rastreabilidade
└── cypress.config.js        # ambientes, timeouts, retries e artefatos
```
