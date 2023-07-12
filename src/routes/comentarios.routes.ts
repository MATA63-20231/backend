import { Router } from 'express'
import ComentariosController from '../controllers/ComentariosController'
import verificaAutenticado from '../middlewares/verificaAutenticado'

const routes = Router()

routes.use(verificaAutenticado)

routes.post('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  const { comentario } = request.body

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

  if (!comentario)
    return response
      .status(400)
      .json({ message: 'É obrigatório incluir um comentário' })

  const comentariosController = new ComentariosController()

  try {
    const responseComentario = await comentariosController.create(
      receitaId,
      comentario,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.put('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params
  const { comentario } = request.body

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
  if (!comentarioId)
    return response
      .status(400)
      .json({ message: 'É obrigatório indicar o comentário alterado' })

  if (!comentario)
    return response
      .status(400)
      .json({ message: 'É obrigatório incluir um comentário' })

  const comentariosController = new ComentariosController()

  try {
    const responseComentario = await comentariosController.update(
      comentarioId,
      comentario,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

routes.delete('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const comentariosController = new ComentariosController()

  if (!comentarioId)
    return response
      .status(400)
      .json({ message: 'É obrigatório indicar o comentário alterado' })

  try {
    const responseComentario = await comentariosController.delete(
      comentarioId,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export default routes
