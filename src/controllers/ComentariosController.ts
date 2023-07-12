import usuariosRepository from '../repositories/usuariosRepository'
import receitasRepository from '../repositories/receitasRepository'
import comentariosRepository from '../repositories/comentariosRepository'

export default class CurtidasController {
  async create(receitaId: string, comentario: string, usuarioId: string) {
    try {
      const receita = await receitasRepository
        .createQueryBuilder('receita')
        .where('id = :id', { id: receitaId })
        .getOne()

      const usuario = await usuariosRepository
        .createQueryBuilder('usuario')
        .where('id = :id', { id: usuarioId })
        .getOne()

      if (!receita) throw new Error('Receita informada é inválida')

      if (!usuario) throw new Error('Usuário informado é inválido')

      const novoComentario = comentariosRepository.create({
        usuario: usuario,
        receita: receita,
        comentario: comentario,
      })

      await comentariosRepository.save(novoComentario)
      return { message: 'Comentário incluido' }
    } catch (error) {
      console.log(error)
      return { error: 'Falha na inclusão do comentário' }
    }
  }

  async update(comentarioId: string, comentario: string, usuarioId: string) {
    try {
      const comentarioAlterado = await comentariosRepository.findOne({
        where: { id: comentarioId },
      })

      if (!comentarioAlterado) throw new Error('Comentário não encontrado')

      if (comentarioAlterado.usuario.id != usuarioId)
        throw new Error(
          'Usuario não tem permissão para alterar este comentário'
        )

      comentarioAlterado.comentario = comentario

      await comentariosRepository.update(
        { id: comentarioId },
        comentarioAlterado
      )

      return { message: 'Comentário alterado' }
    } catch (error) {
      console.log(error)
      return { error: 'Falha na alteração do comentário' }
    }
  }

  async delete(comentarioId: string, usuarioId: string) {
    try {
      const comentario = await comentariosRepository
        .createQueryBuilder('comentario')
        .where(
          'comentario.id = :comentarioId and comentario.usuario.id = :usuarioId',
          { comentarioId: comentarioId, usuarioId: usuarioId }
        )
        .getOne()

      if (!comentario) throw new Error('Comentário não encontrado')

      await comentariosRepository.delete(comentario)

      return { message: 'Comentário removido' }
    } catch (error) {
      console.log(error)
      return { message: 'Falha na remoção do comentário' }
    }
  }
}
