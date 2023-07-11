import { Request, Response } from 'express'

import imagensRepository from '../repositories/imagensRepository'
import { pathImage } from '../config/multer'

export default class ImagensController {
  async create(request: Request, response: Response) {
    try {
      const receitaId = request.params

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!receitaId)
        return response
          .status(400)
          .json({ message: 'É obrigatório indicar a receita' })

      console.log(request.files)

      return response.status(201).json({ message: 'ok' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async obter(request: Request, response: Response) {
    try {
      const { imagemId } = request.params

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!imagemId)
        return response
          .status(400)
          .json({ message: 'É obrigatório indicar a imagem' })

      const imagem = await imagensRepository.findOne({
        where: { id: imagemId },
      })

      if (!imagem)
        return response.status(400).json({ message: 'Imagem não encontrada' })

      return response.status(200).download(`${pathImage}\\${imagem.nome}`)
    } catch (error) {
      console.log(error)
      return response.status(400).json({ Error: error })
    }
  }
}
