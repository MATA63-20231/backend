import { Router } from 'express'
import UsuariosController from '../controllers/UsuariosController'

const routes = Router()

routes.post('/', new UsuariosController().create)

routes.put('/alteracaoSenha', new UsuariosController().updateSenha)

routes.delete('/:id', new UsuariosController().delete)

routes.get('/authenticate', new UsuariosController().authenticate)

export default routes
