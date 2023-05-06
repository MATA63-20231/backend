import express from 'express'
import cors from 'cors'
import routes from './routes'

import './database'

const app = express()
const port = 3334

app.use(cors())
app.use(express.json())
app.use(routes)

app.listen(port, () => {
  console.log(`Server started on port ${port}`)
})
