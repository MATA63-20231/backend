import { Router } from 'express'
import CurtidasController from '../controllers/CurtidasController'
import verificaAutenticado from '../middlewares/verificaAutenticado'

const routes = Router()

routes.use(verificaAutenticado)

routes.post('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  const { curtida }: { curtida: boolean } = request.body
  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
  if (!receitaId)
    return response
      .status(400)
      .json({ message: 'É obrigatório indicar a receita' })

  if (curtida === undefined)
    return response
      .status(400)
      .json({ message: 'A curtida deve ser informada' })

  const curtidasController = new CurtidasController()

  try {
    const responseCurtida = await curtidasController.curtida(
      receitaId,
      curtida,
      usuarioId
    )

    response.status(200).json(responseCurtida)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.delete('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  const curtidasControler = new CurtidasController()

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  if (!receitaId)
    return response
      .status(400)
      .json({ message: 'É obrigatório indicar a receita' })

  try {
    const responseCurtida = await curtidasControler.delete(receitaId, usuarioId)

    response.status(200).json(responseCurtida)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export default routes
