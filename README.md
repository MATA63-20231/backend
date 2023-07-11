# Chef Virtual

Para informações gerais sobre o sistema, acesse: https://github.com/MATA63-20231/geral.

## Tecnologias
Node.js
Yarn
Typescript
MySql

## Principais dependências
Express
TypeORM
Mysql2
ESLint
Prettier
Dotenv

## Instalação
1. Instalação do [Node.js](https://nodejs.org/en/download) versão 18 ou superior
2. Instalação do [MySql](https://www.mysql.com/downloads/) versão 8 ou superior
3. Instalação do Yarn (executar no terminal):
    > npm install yarn
4. Download/atualização das dependências (executar no terminal):
    > yarn
5. Inclusão manual do arquivo **.env** na raíz do projeto
6. Atribuir valor às variáveis de ambiente
    * DB_HOST (Host de acesso ao banco de dados)
    * DB_PORT (Porta de acesso ao banco de dados)
    * DB_USER (Usuário do banco de dados)
    * DB_PASSWORD (Senha do banco de dados)
    * DB_NAME (Nome do schema no banco de dados)
    * PORT (Porta de acesso da aplicação)
7. Execução das migrations (executar no terminal):
    > yarn migration:run

## Execução
Ambiente de homologação:
> yarn dev:server

## Testes
[TODO]

## Lint
ESLint
Prettier

## Como contribuir
Todos os _commits_ devem ser feitos a partir de uma _branch_ não protegida, e submetidos via _Pull Request (PR)_ para a `main`. Para serem _mergeados_, os _PRs_ devem estar de acordo com os seguintes critérios:

- Passar pelos testes;
- Passar pela verificação do lint;
- Possuir pelo menos uma revisão com aprovação.
