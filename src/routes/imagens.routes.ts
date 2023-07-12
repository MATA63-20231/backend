import { Router } from 'express'
import ImagensController from '../controllers/ImagensController'

const routes = Router()

routes.get('/:imagemId', async (request, response) => {
  const { imagemId } = request.params

  const imagensControler = new ImagensController()
  try {
    const responseImagem = await imagensControler.obter(imagemId)

    response.status(200).send(responseImagem)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export default routes
