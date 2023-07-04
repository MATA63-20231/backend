import { Router } from 'express'
import ImagensController from '../controllers/ImagensController'
import multer from 'multer'

const upload = multer({ dest: 'images/' })

const routes = Router()

routes.post(
  '/:receitaId',
  upload.array('imagensReceita'),
  new ImagensController().create
)

export default routes
