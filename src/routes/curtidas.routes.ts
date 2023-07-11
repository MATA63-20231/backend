import { Router } from 'express'
import CurtidasController from '../controllers/CurtidasController'

const routes = Router()

routes.post('/:receitaId', new CurtidasController().curtida)
routes.delete('/:receitaId', new CurtidasController().delete)

export default routes
