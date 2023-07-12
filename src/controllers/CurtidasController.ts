import { Request, Response } from 'express'
import curtidasRepository from '../repositories/curtidasRepository'
import usuariosRepository from '../repositories/usuariosRepository'
import receitasRepository from '../repositories/receitasRepository'

import * as yup from 'yup'
import { ReceitaIdValidate } from '../validates/receitas/index'
import { CurtidaValidate } from '../validates/curtidas/index'

const receitaIdSchema = ReceitaIdValidate;
const curtidaSchema = CurtidaValidate;

const usuarioId = '9f4afde4-63dd-4565-ad94-f7bfdd1218a6'

export default class CurtidasController {
  async curtida(request: Request, response: Response) {
    try {
      const { receitaId } = request.params
      const { curtida } = request.body

      await receitaIdSchema.validate({ receitaId: receitaId }, { strict: true})
      await curtidaSchema.validate({ curtida: curtida }, { strict: true})

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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ') })
      }
      return response.status(400).json({ Error: error })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { receitaId } = request.params
      await receitaIdSchema.validate({ receitaId: receitaId }, { strict: true})

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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ') })
      }
      return response.status(400).json({ Error: error })
    }
  }
}
