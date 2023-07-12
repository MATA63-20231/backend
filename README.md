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
* Instalação do [Docker](https://docs.docker.com/engine/install/)
* Instalação do [Yarn](https://yarnpkg.com/):
   ```bash
   $ npm install -g yarn
   ```

## Instalação e Execução
1. Dentro da pasta do projeto, fazer o download/atualização das dependências:
   ```bash
   $ yarn
   ```
2. Instanciar um banco de dados através do docker:
    ```bash
   $ docker compose up
   ```

3. Acrecsente um arquivo **.env** na raíz do projeto, contendo as seguintes variáveis de ambiente:
    ```
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=chef-virtual
    DB_PASSWORD=chef-virtual
    DB_NAME=chef-virtual
    PORT=3000
    ```
  
4. Execução das migrations:
   ```bash
   $ yarn migration:run
   ```

5. Rode o ambiente de homologação:
   ```bash
   $ yarn dev:server
   ```

## Testes
```bash
$ yarn test:run
```

## Lint
```bash
$ yarn lint
```

## Como contribuir
Todos os _commits_ devem ser feitos a partir de uma _branch_ não protegida, e submetidos via _Pull Request (PR)_ para a `main`. Para serem _mergeados_, os _PRs_ devem estar de acordo com os seguintes critérios:

- Passar pelos testes;
- Passar pela verificação do lint.
