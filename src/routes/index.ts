import { Router } from 'express'
import receitasRouter from '../routes/receitas.routes'
import usuariosRouter from '../routes/usuarios.routes'
import imagensRouter from '../routes/imagens.routes'
import curtidasRouter from '../routes/curtidas.routes'
import comentariosRouter from '../routes/comentarios.routes'

const routes = Router()

routes.use('/receita', receitasRouter)
routes.use('/usuario', usuariosRouter)
routes.use('/imagem', imagensRouter)
routes.use('/curtida', curtidasRouter)
routes.use('/comentario', comentariosRouter)

export default routes
