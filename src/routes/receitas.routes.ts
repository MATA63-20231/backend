import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'

const routes = Router()

routes.get('/all', new ReceitasController().findAll)

routes.get('/', new ReceitasController().findByTitulo)

routes.get('/:id', new ReceitasController().findById)

routes.post('/', new ReceitasController().create)

routes.delete('/:id', new ReceitasController().delete)

export default routes
