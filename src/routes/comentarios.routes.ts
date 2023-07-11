import { Router } from 'express'
import ComentariosController from '../controllers/ComentariosController'

const routes = Router()

routes.post('/:receitaId', new ComentariosController().create)
routes.put('/:comentarioId', new ComentariosController().update)
routes.delete('/:comentarioId', new ComentariosController().delete)
routes.post('/resposta/:comentarioId', new ComentariosController().resposta)
routes.get(
  '/resposta/:comentarioId',
  new ComentariosController().listarRespostas
)

export default routes
