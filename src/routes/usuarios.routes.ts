import { Router } from 'express'
import UsuariosController from '../controllers/UsuariosController'
import { authenticateUsuaroioDTO } from '../util/types'

const routes = Router()

routes.post('/', async (request, response) => {
  const { usuario, nome, email, senha, confirmacaoSenha } = request.body

  //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
  if (!usuario)
    return response.status(400).json({ message: 'O username é obrigatório' })

  if (!senha || !confirmacaoSenha || senha != confirmacaoSenha)
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
    return response.status(400).json({ message: error })
  }
})

routes.put('/alteracaoSenha', async (request, response) => {
  const { usuario, senhaAtual, novaSenha, confirmacaoSenha } = request.body

  if (!usuario)
    return response.status(400).json({ message: 'Usuário inválido! ' })

  if (
    !senhaAtual ||
    !novaSenha ||
    !confirmacaoSenha ||
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
  const { usuario, senha }: authenticateUsuaroioDTO = request.body

  if (!usuario || !senha)
    return response.status(400).json({ message: 'Falha na autenticação' })

  const usuariosController = new UsuariosController()

  const responseAuthenticate = await usuariosController.authenticate({
    usuario,
    senha,
  })

  response.status(200).json(responseAuthenticate)
})

export default routes
