import { Request, Response } from 'express'

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
}
