import { Router } from 'express'
import ReceitasController from '../controllers/ReceitasController'
import multer from 'multer'
import { storage } from '../config/multer'
import verificaAutenticado from '../middlewares/verificaAutenticado'

const upload = multer(storage)

const routes = Router()

routes.get('/all', async (request, response) => {
  const receitasControler = new ReceitasController()

  try {
    const receitas = await receitasControler.findAll()
    response.status(200).json(receitas)
  } catch (error) {
    console.log(error)
    response.status(200).json(error)
  }
})

routes.get('/', async (request, response) => {
  const { titulo } = request.body

  const receitasController = new ReceitasController()

  try {
    const receitas = await receitasController.findByTitulo(titulo)

    response.status(200).json(receitas)
  } catch (error) {
    console.log(error)
    response.status(200).json(error)
  }
})

routes.get('/:id', async (request, response) => {
  const { id } = request.params

  const receitasController = new ReceitasController()

  try {
    const receitas = await receitasController.findById(id)
    response.status(200).json(receitas)
  } catch (error) {
    console.log(error)
    response.status(200).json(error)
  }
})

routes.post(
  '/',
  verificaAutenticado,
  upload.array('imagens'),
  async (request, response) => {
    const receitasController = new ReceitasController()

    const {
      titulo,
      descricao,
      rendimento,
      tempoPreparo,
      listaPreparo,
      ingredientes,
    } = request.body

    /* eslint-disable */
    // @ts-ignore
    const usuario = request.usuario
    /* eslint-enable */

    if (!usuario)
      return response.status(401).json({ message: 'Usuário não autorizado.' })

    if (!titulo)
      return response.status(400).json({ message: 'O título é obrigatório.' })

    const listaIngredientes =
      typeof ingredientes == 'string' ? JSON.parse(ingredientes) : ingredientes

    if (!listaIngredientes || listaIngredientes.length < 1)
      return response
        .status(400)
        .json({ message: 'Cadastro de ingredientes é obrigatório.' })

    if (!rendimento || rendimento == 0)
      return response
        .status(400)
        .json({ message: 'O rendimento deve ser superior a 0.' })

    const tempo: { minutos: number; horas: number } =
      typeof tempoPreparo == 'string' ? JSON.parse(tempoPreparo) : tempoPreparo

    if (
      !tempo ||
      (!tempo.minutos && !tempo.horas) ||
      (tempo.minutos <= 0 && tempo.horas <= 0)
    )
      return response
        .status(400)
        .json({ message: 'Tempo de preparo deve ser superior a 0.' })

    if (tempo.minutos > 59)
      return response.status(400).json({
        message:
          'Quantidade de minutos para preparo não pode ser superior a 59 minutos.',
      })

    const tempoMinutos =
      (tempo.minutos ? tempo.minutos : 0) + (tempo.horas ? tempo.horas * 60 : 0)

    if (ingredientes.length <= 0)
      return response.status(400).json({
        message: 'Obrigatório o cadastro de ao menos um ingrediente.',
      })

    if (listaPreparo.length <= 0)
      return response.status(400).json({
        message: 'Obrigatório o cadastro de item para preparo.',
      })

    const preparo =
      typeof listaPreparo == 'string' ? JSON.parse(listaPreparo) : listaPreparo

    const files = request.files

    /* eslint-disable */
    try {
      const receitas = await receitasController.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
        listaPreparo: preparo,
        listaIngredientes,
        usuarioId: usuario,
        // @ts-ignore
        files,
      })
      response.status(200).json(receitas)
    } catch (error) {
      console.log(error)
      response.status(400).json({ error: 'Falha na inclusão da receita' })
    }
    /* eslint-enable */
  }
)

routes.put(
  '/:receitaId',
  verificaAutenticado,
  upload.array('imagens'),
  async (request, response) => {
    const receitasController = new ReceitasController()

    const {
      titulo,
      descricao,
      rendimento,
      tempoPreparo,
      listaPreparo,
      ingredientes,
    } = request.body

    const { receitaId } = request.params

    /* eslint-disable */
    // @ts-ignore
    const usuario = request.usuario
    /* eslint-enable */

    if (!usuario)
      return response.status(401).json({ message: 'Usuário não autorizado.' })

    if (!titulo)
      return response.status(400).json({ message: 'O título é obrigatório.' })

    const listaIngredientes =
      typeof ingredientes == 'string' ? JSON.parse(ingredientes) : ingredientes

    if (!listaIngredientes || listaIngredientes.length < 1)
      return response
        .status(400)
        .json({ message: 'Cadastro de ingredientes é obrigatório.' })

    if (!rendimento || rendimento == 0)
      return response
        .status(400)
        .json({ message: 'O rendimento deve ser superior a 0.' })

    const tempo: { minutos: number; horas: number } =
      typeof tempoPreparo == 'string' ? JSON.parse(tempoPreparo) : tempoPreparo

    if (
      !tempo ||
      (!tempo.minutos && !tempo.horas) ||
      (tempo.minutos <= 0 && tempo.horas <= 0)
    )
      return response
        .status(400)
        .json({ message: 'Tempo de preparo deve ser superior a 0.' })

    if (tempo.minutos > 59)
      return response.status(400).json({
        message:
          'Quantidade de minutos para preparo não pode ser superior a 59 minutos.',
      })

    const tempoMinutos =
      (tempo.minutos ? tempo.minutos : 0) + (tempo.horas ? tempo.horas * 60 : 0)

    if (ingredientes.length <= 0)
      return response.status(400).json({
        message: 'Obrigatório o cadastro de ao menos um ingrediente.',
      })

    if (listaPreparo.length <= 0)
      return response.status(400).json({
        message: 'Obrigatório o cadastro de item para preparo.',
      })

    const preparo =
      typeof listaPreparo == 'string' ? JSON.parse(listaPreparo) : listaPreparo

    const files = request.files

    /* eslint-disable */
    try {
      const receitas = await receitasController.edit({
        receitaId,
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
        listaPreparo: preparo,
        listaIngredientes,
        usuarioId: usuario,
        // @ts-ignore
        files,
      })
      response.status(200).json(receitas)
    } catch (error) {
      console.log(error)
      response.status(400).json(error)
    }
    /* eslint-enable */
  }
)

routes.delete('/:id', async (request, response) => {
  const { id } = request.params

  const receitasControler = new ReceitasController()

  try {
    const responseDelete = await receitasControler.delete(id)

    response.status(200).json(responseDelete)
  } catch (error) {
    console.log(error)
    response.status(400).json(error)
  }
})

export default routes
