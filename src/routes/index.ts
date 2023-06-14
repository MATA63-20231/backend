import { Router } from 'express'
const ReceitasController = require('../controllers/ReceitasController')

const routes = Router()

routes.get('/', ReceitasController.getStatus)

routes.get('/receitas', ReceitasController.findAll)
routes.get('/receita', ReceitasController.findByTitulo)
routes.post('/receita', ReceitasController.create)

export default routes
