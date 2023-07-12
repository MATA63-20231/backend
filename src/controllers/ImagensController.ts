import imagensRepository from '../repositories/imagensRepository'
import { pathImage } from '../config/multer'

export default class ImagensController {
  async obter(imagemId: string) {
    try {
      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!imagemId) throw new Error('É obrigatório indicar a imagem')

      const imagem = await imagensRepository.findOne({
        where: { id: imagemId },
      })

      if (!imagem) throw new Error('Imagem não encontrada')

      return `${pathImage}/${imagem.nome}`
    } catch (error) {
      console.log(error)
      throw new Error('Falha ao salvar imagem')
    }
  }
}
