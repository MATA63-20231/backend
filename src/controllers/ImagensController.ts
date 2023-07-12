import { Request, Response } from 'express'

import imagensRepository from '../repositories/imagensRepository'
import { pathImage } from '../config/multer'
import * as yup from 'yup'
import { ReceitaIdValidate } from '../validates/receitas/index'
import { ImagemIdValidate } from '../validates/imagens/index'

const receitaIdSchema = ReceitaIdValidate;
const imagemIdSchema = ImagemIdValidate;
export default class ImagensController {
  async create(request: Request, response: Response) {
    try {
      const receitaId = request.params
      await receitaIdSchema.validate({receitaId}, { strict: true})

      return response.status(201).json({ message: 'ok' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ') })
      }

      return response.status(400).json({ Error: error })
    }
  }

  async obter(request: Request, response: Response) {
    try {
      const { imagemId } = request.params
      await imagemIdSchema.validate({imagemId}, { strict: true})  
      
      const imagem = await imagensRepository.findOne({
        where: { id: imagemId },
      })

      if (!imagem)
        return response.status(400).json({ message: 'Imagem não encontrada' })

      return response.status(200).download(`${pathImage}\\${imagem.nome}`)
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ') })
      }
      return response.status(400).json({ Error: error })
    }
  }
}
