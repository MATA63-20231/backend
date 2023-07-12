import { Router } from 'express'
import verificaAutenticado from '../middlewares/verificaAutenticado'
import RespostasController from '../controllers/RespostasController'

const routes = Router()

routes.use(verificaAutenticado)

routes.post('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params
  const { resposta }: { resposta: string } = request.body

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  if (!resposta) throw new Error('Nenhuma resposta informada')

  const respostasController = new RespostasController()

  try {
    const responseResposta = await respostasController.create(
      comentarioId,
      resposta,
      usuarioId
    )
    response.status(200).json(responseResposta)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.put('/:respostaId', async (request, response) => {
  const { respostaId } = request.params
  const { resposta }: { resposta: string } = request.body

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  if (!resposta) throw new Error('Nenhuma resposta informada')

  const respostasController = new RespostasController()

  try {
    const responseResposta = await respostasController.update(
      respostaId,
      resposta,
      usuarioId
    )
    response.status(200).json(responseResposta)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.delete('/:respostaId', async (request, response) => {
  const { respostaId } = request.params

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const respostasController = new RespostasController()

  try {
    const responseResposta = await respostasController.delete(
      respostaId,
      usuarioId
    )
    response.status(200).json(responseResposta)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.get('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params

  const respostasController = new RespostasController()

  try {
    const responseResposta = respostasController.getRespostas(comentarioId)
    response.status(200).json(responseResposta)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export default routes
