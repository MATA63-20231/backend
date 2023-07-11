import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'
import multer from 'multer'
import { storage } from '../config/multer'

const upload = multer(storage)

const routes = Router()

routes.get('/all', new ReceitasController().findAll)

routes.get('/', new ReceitasController().findByTitulo)

routes.get('/:id', new ReceitasController().findById)

routes.post('/', upload.array('imagens'), new ReceitasController().create)

routes.put(
  '/:receitaId',
  upload.array('imagens'),
  new ReceitasController().edit
)

routes.delete('/:id', new ReceitasController().delete)

export default routes
