import { Router } from 'express'
import ComentariosController from '../controllers/ComentariosController'
import verificaAutenticado from '../middlewares/verificaAutenticado'

import * as yup from 'yup'
import { 
  ComentarioValidate,
  ComentarioIdValidate,
} from '../validates/comentarios'
import { ReceitaIdValidate } from '../validates/receitas'

const comentariosSchema = ComentarioValidate;
const comentarioIdSchema = ComentarioIdValidate;
const receitaIdSchema   = ReceitaIdValidate;

const routes = Router()

routes.use(verificaAutenticado)

routes.post('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  const { comentario } = request.body

  await receitaIdSchema.validate({ receitaId }, {strict: true})
  await comentariosSchema.validate({ comentario }, {strict: true})

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const comentariosController = new ComentariosController()

  try {
    const responseComentario = await comentariosController.create(
      receitaId,
      comentario,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    if(error instanceof yup.ValidationError){
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

routes.put('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params
  const { comentario } = request.body

  await comentarioIdSchema.validate({ comentarioId }, {strict: true})
  await comentariosSchema.validate({ comentario }, {strict: true})

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const comentariosController = new ComentariosController()

  try {
    const responseComentario = await comentariosController.update(
      comentarioId,
      comentario,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

routes.delete('/:comentarioId', async (request, response) => {
  const { comentarioId } = request.params
  await comentarioIdSchema.validate({ comentarioId }, {strict: true})

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const comentariosController = new ComentariosController()

  try {
    const responseComentario = await comentariosController.delete(
      comentarioId,
      usuarioId
    )
    response.status(200).json(responseComentario)
  } catch (error) {
    if(error instanceof yup.ValidationError){
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

export default routes
