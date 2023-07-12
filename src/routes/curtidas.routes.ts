import { Router } from 'express'
import CurtidasController from '../controllers/CurtidasController'
import verificaAutenticado from '../middlewares/verificaAutenticado'

import * as yup from 'yup'
import {
  CurtidaValidate,
} from '../validates/curtidas'

import {
  ReceitaIdValidate
} from '../validates/receitas'

const curtidaSchema = CurtidaValidate;
const receitaIdSchema = ReceitaIdValidate;

const routes = Router()

routes.use(verificaAutenticado)

routes.post('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  const { curtida }: { curtida: boolean } = request.body

  await receitaIdSchema.validate({ receitaId }, { strict: true })
  await curtidaSchema.validate({ curtida }, { strict: true })

  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  const curtidasController = new CurtidasController()

  try {
    const responseCurtida = await curtidasController.curtida(
      receitaId,
      curtida,
      usuarioId
    )

    response.status(200).json(responseCurtida)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

routes.delete('/:receitaId', async (request, response) => {
  const { receitaId } = request.params
  await receitaIdSchema.validate({ receitaId }, { strict: true })


  /* eslint-disable */
  // @ts-ignore
  const usuarioId = request.usuario?.id
  /* eslint-enable */

  const curtidasControler = new CurtidasController()

  if (!usuarioId)
    return response.status(401).json({ message: 'Usuário não autorizado.' })

  try {
    const responseCurtida = await curtidasControler.delete(receitaId, usuarioId)

    response.status(200).json(responseCurtida)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json(error)
  }
})

export default routes
