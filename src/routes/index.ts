import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'

const routes = Router()

routes.get('/receita', (request, response) => {
  return response.json({ message: 'Rota inicial' })
})

routes.post('/receita', new ReceitasController().create)

export default routes
