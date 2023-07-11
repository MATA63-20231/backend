# Chef Virtual

Para informações gerais sobre o sistema, acesse: https://github.com/MATA63-20231/geral.

## Tecnologias
* Node.js;
* Yarn;
* Typescript;
* MySql.

## Principais dependências
* Express;
* TypeORM;
* Mysql2;
* ESLint;
* Prettier;
* Dotenv.

## Pré-requisitos
* Instalação do [Node.js](https://nodejs.org/en/download) versão 14.x;
* Instalação do [MySql](https://www.mysql.com/downloads/) versão 8 ou superior;
* Instalação do [Yarn](https://yarnpkg.com/):
   ```bash
   npm install -g yarn
   ```

## Instalação
1. Dentro da pasta do projeto, fazer o download/atualização das dependências:
   ```bash
   yarn
   ```

2. Criar um arquivo **.env** na raíz do projeto, contendo as seguintes variáveis de ambiente:
    * `DB_HOST` (Host de acesso ao banco de dados)
    * `DB_PORT` (Porta de acesso ao banco de dados)
    * `DB_USER` (Usuário do banco de dados)
    * `DB_PASSWORD` (Senha do banco de dados)
    * `DB_NAME` (Nome do schema no banco de dados)
    * `PORT` (Porta de acesso da aplicação)

3. Execução das migrations:
   ```bash
   yarn migration:run
   ```

## Execução
Ambiente de homologação:
```bash
yarn dev:server
```

## Testes
[TODO]

## Lint
[TODO]

## Como contribuir
Todos os _commits_ devem ser feitos a partir de uma _branch_ não protegida, e submetidos via _Pull Request (PR)_ para a `main`. Para serem _mergeados_, os _PRs_ devem estar de acordo com os seguintes critérios:

- Passar pelos testes;
- Passar pela verificação do lint.
