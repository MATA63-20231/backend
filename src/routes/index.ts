import { Router } from 'express'
import receitasRouter from '../routes/receitas.routes'
import usuariosRouter from '../routes/usuarios.routes'
import imagensRouter from '../routes/imagens.routes'
import curtidasRouter from '../routes/curtidas.routes'
import comentariosRouter from '../routes/comentarios.routes'
import respostasRouter from '../routes/respostas.routes'

const routes = Router()

routes.get('/', function( req, resp) {
    resp.send("ONLINE");
})
routes.use('/receita', receitasRouter)
routes.use('/usuario', usuariosRouter)
routes.use('/imagem', imagensRouter)
routes.use('/curtida', curtidasRouter)
routes.use('/comentario', comentariosRouter)
routes.use('/resposta', respostasRouter)

export default routes
