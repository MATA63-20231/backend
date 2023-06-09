import 'dotenv/config'
import 'reflect-metadata'
import { DataSource } from 'typeorm'

const host = process.env.DB_HOST
const database = process.env.DB_NAME
const username = process.env.DB_USER
const port = process.env.DB_PORT as number | undefined
const password = process.env.DB_PASSWORD

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: host,
  port: port,
  username: username,
  password: password,
  database: database,
  synchronize: false, //True só em ambiente de desenvolvimento
  logging: false,
  entities: [`./src/models/*.{ts,js}`],
  subscribers: [],
  migrations: [`${__dirname}/**/migrations/*.{ts,js}`],
})
