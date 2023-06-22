import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'

const routes = Router()

routes.get('/receitas', new ReceitasController().findAll)

routes.get('/receita', new ReceitasController().findByTitulo)

routes.get('/receita/:id', new ReceitasController().findById)

routes.post('/receita', new ReceitasController().create)

routes.delete('/receita/:id', new ReceitasController().delete)

export default routes
