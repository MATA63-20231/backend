import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'

const routes = Router()

routes.get('/receitas', new ReceitasController().findAll)

routes.get('/receita', new ReceitasController().findByTitulo)

routes.post('/receita', new ReceitasController().create)

export default routes
