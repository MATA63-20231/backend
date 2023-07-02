import { Router } from 'express'
import UsuariosController from '../controllers/UsuariosController'

const routes = Router()

routes.post('/', new UsuariosController().create)

routes.put('/', new UsuariosController().updateSenha)

routes.delete('/:id', new UsuariosController().delete)

export default routes
