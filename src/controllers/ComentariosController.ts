import { Request, Response } from 'express'
import usuariosRepository from '../repositories/usuariosRepository'
import receitasRepository from '../repositories/receitasRepository'
import comentariosRepository from '../repositories/comentariosRepository'

import * as yup from 'yup'
import { ReceitaIdValidate } from '../validates/receitas/index'
import { 
  ComentarioValidate,
  ComentarioIdValidate,
} from '../validates/comentarios'

const receitaIdSchema = ReceitaIdValidate;
const comentarioSchema = ComentarioValidate;
const comentarioIdSchema = ComentarioIdValidate;

const usuarioId = '9f4afde4-63dd-4565-ad94-f7bfdd1218a6'

export default class CurtidasController {
  async create(request: Request, response: Response) {
    try {
      const { receitaId } = request.params
      const { comentario } = request.body

      await receitaIdSchema.validate({ receitaId: receitaId }, { strict: true})
      await comentarioSchema.validate({ comentario: comentario }, { strict: true})
      
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

      const novoComentario = comentariosRepository.create({
        usuario: usuario,
        receita: receita,
        comentario: comentario,
        principal: true,
      })

      await comentariosRepository.save(novoComentario)
      return response.status(200).json({ message: 'Comentário incluido' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ')})
      }

      return response.status(400).json({ Error: error })
    }
  }

  async resposta(request: Request, response: Response) {
    try {
      const { comentarioId } = request.params
      const { comentario } = request.body

      await comentarioIdSchema.validate({ comentarioId: comentarioId }, { strict: true})
      await comentarioSchema.validate({ comentario: comentario }, { strict: true})
      
      const usuario = await usuariosRepository
        .createQueryBuilder('usuario')
        .where('id = :id', { id: usuarioId })
        .getOne()

      if (!usuario)
        return response
          .status(400)
          .json({ message: 'Usuário informado é inválido' })

      const comentarioPai = await comentariosRepository
        .createQueryBuilder('comentario')
        .innerJoinAndSelect('comentario.usuario', 'usuario')
        .innerJoinAndSelect('comentario.receita', 'receita')
        .where('comentario.id = :comentarioId', { comentarioId: comentarioId })
        .getOne()

      if (!comentarioPai || !comentarioPai.comentario)
        return response
          .status(400)
          .json({ message: 'Comentário não encontrado' })

      const receita = comentarioPai.receita

      const novoComentario = comentariosRepository.create({
        usuario: usuario,
        receita: receita,
        comentario: comentario,
        comentarioPai: comentarioPai,
        temResposta: true,
      })

      await comentariosRepository.save(novoComentario)
      return response.status(200).json({ message: 'Comentário respondido' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ')})
      }
      return response.status(400).json({ Error: error })
    }
  }

  async update(request: Request, response: Response) {
    try {
      const { comentarioId } = request.params
      const { comentario } = request.body

      await comentarioIdSchema.validate({ comentarioId: comentarioId }, { strict: true})
      await comentarioSchema.validate({ comentario: comentario }, { strict: true})  

      const comentarioAlterado = await comentariosRepository.findOne({
        where: { id: comentarioId },
      })

      if (!comentarioAlterado)
        return response
          .status(400)
          .json({ message: 'Comentário não encontrado' })

      if (comentarioAlterado.usuario.id != usuarioId)
        return response.status(400).json({
          message: 'Usuario não tem permissão para alterar este comentário',
        })

      comentarioAlterado.comentario = comentario

      await comentariosRepository.update(
        { id: comentarioId },
        comentarioAlterado
      )

      return response.status(200).json({ message: 'Comentário alterado' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ')})
      }
      return response.status(400).json({ Error: error })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { comentarioId } = request.params

      await comentarioIdSchema.validate({ comentarioId: comentarioId }, { strict: true})

      const comentario = await comentariosRepository
        .createQueryBuilder('comentario')
        .where('comentario.id = :comentarioId ', { comentarioId: comentarioId })
        .getOne()

      if (!comentario)
        return response
          .status(400)
          .json({ message: 'Comentário não encontrado' })

      if (comentario.comentarioPai) {
        const comentariosFilhosMesmoPai = await comentariosRepository
          .createQueryBuilder('comentario')
          .where('comentario.comentarioPai.id = :comentarioPaiId', {
            comentarioPaiId: comentario.comentarioPai.id,
          })
          .getMany()

        if (!comentariosFilhosMesmoPai) {
          const comentarioPai = await comentariosRepository
            .createQueryBuilder('comentario')
            .where('comentario.id = :comentarioId ', {
              comentarioId: comentario.comentarioPai.id,
            })
            .getOne()

          if (comentarioPai) {
            comentarioPai.temResposta = false
            await comentariosRepository.update(
              { id: comentarioPai.id },
              comentarioPai
            )
          }
        }
      }

      comentariosRepository.remove(comentario)

      return response.status(201).json({ message: 'Comentário removida' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ')})
      }
      return response.status(400).json({ Error: error })
    }
  }

  async listarRespostas(request: Request, response: Response) {
    try {
      const { comentarioId } = request.params
      await comentarioIdSchema.validate({ comentarioId: comentarioId }, { strict: true})
      
      const comentarioPai = await comentariosRepository.findOne({
        where: { id: comentarioId },
      })

      if (!comentarioPai)
        return response
          .status(400)
          .json({ message: 'Comentário pai não encontrado' })

      const comentariosFilhos = await comentariosRepository.find({
        where: {
          comentarioPai: comentarioPai,
        },
      })

      if (!comentariosFilhos)
        return response
          .status(400)
          .json({ message: 'Comentários filhos não encotnrados' })

      return response.status(201).json(comentariosFilhos)
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ')})
      }
      return response.status(400).json({ Error: error })
    }
  }
}
