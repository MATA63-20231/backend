import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import routes from './routes'

import { AppDataSource } from './database'

AppDataSource.initialize()
  .then(async () => {
    console.log(`Connected to ${process.env.DB_NAME} database`)
  })
  .catch(error => console.log(error))

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(routes)
app.listen(port, () => {
  console.log(`Server started on port ${port}`)
  console.log(__dirname)
})
