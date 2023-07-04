import { Router } from 'express'
import receitasRouter from '../routes/receitas.routes'
import usuariosRouter from '../routes/usuarios.routes'
import imagensRouter from '../routes/imagens.routes'

const routes = Router()

routes.use('/receita', receitasRouter)
routes.use('/usuario', usuariosRouter)
routes.use('/imagem', imagensRouter)

export default routes
