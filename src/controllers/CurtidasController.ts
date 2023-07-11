import { Request, Response } from 'express'
import curtidasRepository from '../repositories/curtidasRepository'
import usuariosRepository from '../repositories/usuariosRepository'
import receitasRepository from '../repositories/receitasRepository'

export default class CurtidasController {
  async curtida(request: Request, response: Response) {
    try {
      const { receitaId } = request.params
      const { curtida } = request.body

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!receitaId)
        return response
          .status(400)
          .json({ message: 'É obrigatório indicar a receita' })

      if (curtida === undefined)
        return response
          .status(400)
          .json({ message: 'A curtida deve ser informada' })

      const usuarioId = '9f4afde4-63dd-4565-ad94-f7bfdd1218a6'

      const curtidaUsuarioReceita = await curtidasRepository
        .createQueryBuilder('curtida')
        .where(
          'curtida.receita.id = :receitaId and curtida.usuario.id = :usuarioId ',
          { receitaId: receitaId, usuarioId: usuarioId }
        )
        .getOne()

      if (curtidaUsuarioReceita) {
        curtidaUsuarioReceita.curtida = curtida
        curtidasRepository.update(
          { id: curtidaUsuarioReceita.id },
          curtidaUsuarioReceita
        )
      } else {
        const receita = await receitasRepository
          .createQueryBuilder('receita')
          .where('id = :id', { id: receitaId })
          .getOne()

        const usuario = await usuariosRepository
          .createQueryBuilder('usuario')
          .where('id = :id', { id: usuarioId })
          .getOne()

        if (!receita)
          return response
            .status(400)
            .json({ message: 'Receita informada é inválida' })

        if (!usuario)
          return response
            .status(400)
            .json({ message: 'Usuário informado é inválido' })

        const novaCurtida = curtidasRepository.create({
          usuario: usuario,
          receita: receita,
          curtida: curtida,
        })

        await curtidasRepository.save(novaCurtida)
      }
      return response.status(200).json({ message: 'Curtida incluida' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { receitaId } = request.params

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!receitaId)
        return response
          .status(400)
          .json({ message: 'É obrigatório indicar a receita' })

      const usuarioId = '9f4afde4-63dd-4565-ad94-f7bfdd1218a6'

      const curtida = await curtidasRepository
        .createQueryBuilder('curtida')
        .where(
          'curtida.receita.id = :receitaId and curtida.usuario.id = :usuarioId ',
          { receitaId: receitaId, usuarioId: usuarioId }
        )
        .getOne()

      if (!curtida)
        return response.status(400).json({ message: 'Curtida não encontrada' })

      await curtidasRepository.remove(curtida)

      return response.status(200).json({ message: 'Curtida removida' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }
}
