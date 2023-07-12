import { Router } from 'express'
import UsuariosController from '../controllers/UsuariosController'
import { authenticateUsuaroioDTO } from '../util/types'

import * as yup from 'yup'
import { 
  CreateValidate,
  UpdateValidate,
  AuthenticateValidate
} from '../validates/user'

const userCreateSchema = CreateValidate;
const updateSchema = UpdateValidate;
const authenticateSchema = AuthenticateValidate;

const routes = Router()

routes.post('/', async (request, response) => {
  const { usuario, nome, email, senha, confirmacaoSenha } = request.body
  await userCreateSchema.validate({
     usuario, nome, email, senha, confirmacaoSenha
    }, { strict: true})

  //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
 
  if ( senha != confirmacaoSenha)
    return response
      .status(400)
      .json({ message: 'A senha e a confirmação não coincidem' })

  const usuariosControler = new UsuariosController()

  try {
    const usuarioCriado = await usuariosControler.create({
      usuario,
      nome,
      email,
      senha,
    })

    return response.status(200).json(usuarioCriado)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    return response.status(400).json({ message: error })
  }
})

routes.put('/alteracaoSenha', async (request, response) => {
  const { usuario, senhaAtual, novaSenha, confirmacaoSenha } = request.body
  await updateSchema.validate({
    usuario, senhaAtual, novaSenha, confirmacaoSenha
  }, { strict: true})

  if (
    novaSenha != confirmacaoSenha
  ) {
    return response
      .status(400)
      .json({ message: 'A senha e a confirmação não coincidem' })
  }

  const usuariosController = new UsuariosController()
  try {
    const usuarioAlterado = await usuariosController.updateSenha({
      usuario,
      senhaAtual,
      novaSenha,
      confirmacaoSenha,
    })

    return response.status(200).json(usuarioAlterado)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    return response.status(400).json({ error: error })
  }
})

routes.delete('/:id', async (request, response) => {
  const { id } = request.params

  const usuariosControler = new UsuariosController()

  const resposeUsuario = await usuariosControler.delete(id)

  response.status(200).json(resposeUsuario)
})

routes.post('/authenticate', async (request, response) => {
  try {
    const { usuario, senha }: authenticateUsuaroioDTO = request.body

    await authenticateSchema.validate({
      usuario, senha
    }, { strict: true})

    const usuariosController = new UsuariosController()

    const responseAuthenticate = await usuariosController.authenticate({
      usuario,
      senha,
    })

    response.status(200).json(responseAuthenticate)
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      response.status(400).json(error.errors.join(', '))
    }
    response.status(400).json({ error })
  }
  
})

export default routes
