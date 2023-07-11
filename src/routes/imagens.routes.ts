import { Router } from 'express'
import ImagensController from '../controllers/ImagensController'

const routes = Router()

routes.get('/:imagemId', new ImagensController().obter)

export default routes
