import { Router } from 'express'
import ImagensController from '../controllers/ImagensController'

import * as yup from 'yup'
import {
  ImagemIdValidate,
} from '../validates/imagens'

const imagemIdSchema = ImagemIdValidate;

const routes = Router()

routes.get('/:imagemId', async (request, response) => {
  const { imagemId } = request.params
  await imagemIdSchema.validate({ imagemId }, { strict: true })

  const imagensControler = new ImagensController()
  try {
    const responseImagem = await imagensControler.obter(imagemId)

    response.status(200).send(responseImagem)
  } catch (error) {
    if(error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

export default routes
