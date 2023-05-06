import 'reflect-metadata'
import { DataSource } from 'typeorm'

const host = 'localhost'
const port = 3306
const database = 'receitas' //process.env.PROJECT_NAME
const username = 'root' //process.env.USERNAME
const password = undefined //process.env.PASSWORD

const AppDataSource = new DataSource({
  type: 'mysql',
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  synchronize: true,
  logging: false,
  entities: [],
  subscribers: [],
  migrations: [],
})

AppDataSource.initialize()
  .then(async () => {
    console.log(`Connected to ${database} database`)
  })
  .catch(error => console.log(error))
