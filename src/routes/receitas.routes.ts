import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'
import multer from 'multer'

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, './images/')
  },
  filename: (request, file, cb) => {
    cb(null, new Date().getTime() + file.originalname)
  },
})

const upload = multer({ storage: storage })

const routes = Router()

routes.get('/all', new ReceitasController().findAll)

routes.get('/', new ReceitasController().findByTitulo)

routes.get('/:id', new ReceitasController().findById)

routes.post('/', upload.array('imagens'), new ReceitasController().create)

routes.delete('/:id', new ReceitasController().delete)

export default routes
