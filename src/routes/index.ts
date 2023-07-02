import { Router } from 'express'
import receitasRouter from '../routes/receitas.routes'
import usuariosRouter from '../routes/usuarios.routes'

const routes = Router()

routes.use('/receita', receitasRouter)
routes.use('/usuario', usuariosRouter)

export default routes
