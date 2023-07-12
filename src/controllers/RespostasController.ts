import usuariosRepository from '../repositories/usuariosRepository'
import respostasRepository from '../repositories/respostasRepository'
import comentariosRepository from '../repositories/comentariosRepository'

export default class RespostasController {
  async create(comentarioId: string, resposta: string, usuarioId: string) {
    try {
      const comentario = await comentariosRepository.findOne({
        where: { id: comentarioId },
      })

      if (!comentario) throw new Error('Comentário informado é inválido')

      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario) throw new Error('Usuário informado é inválido')

      const novaResposta = respostasRepository.create({
        usuario: usuario,
        resposta: resposta,
        comentario: comentario,
      })

      await respostasRepository.insert(novaResposta)
      return { message: 'Comentário respondido' }
    } catch (error) {
      console.log(error)
      return { error: 'Falha na inclusão da resposta' }
    }
  }

  async update(respostaId: string, resposta: string, usuarioId: string) {
    try {
      const respostaAlterada = await respostasRepository.findOne({
        where: { id: respostaId },
      })

      if (!respostaAlterada) throw new Error('Comentário não encontrado')

      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario) throw new Error('Usuário informado é inválido')

      if (respostaAlterada.usuario.id != usuario.id)
        throw new Error(
          'Usuario não tem permissão para alterar este comentário'
        )

      respostaAlterada.resposta = resposta

      await respostasRepository.update({ id: respostaId }, respostaAlterada)

      return { message: 'Resposta alterada' }
    } catch (error) {
      console.log(error)
      return { error: 'Falha na alteração do resposta' }
    }
  }

  async delete(respostaId: string, usuarioId: string) {
    try {
      const respostaExcluida = await respostasRepository.findOne({
        where: { id: respostaId },
      })

      if (!respostaExcluida) throw new Error('Resposta não encontrado')

      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario) throw new Error('Usuário informado é inválido')

      if (respostaExcluida.usuario.id != usuario.id)
        throw new Error(
          'Usuario não tem permissão para alterar este comentário'
        )

      await respostasRepository.delete(respostaExcluida)

      return { message: 'Comentário removido' }
    } catch (error) {
      console.log(error)
      return { message: 'Falha na remoção do comentário' }
    }
  }

  async getRespostas(comentarioId: string) {
    try {
      const respostas = await respostasRepository
        .createQueryBuilder('resposta')
        .where('resposta.comentario.id = :id', { id: comentarioId })
        .getMany()

      if (!respostas) throw new Error('Respostas não encontradas')

      return respostas
    } catch (error) {
      console.log(error)
      return { message: 'Falha na obtenção das respostas' }
    }
  }
}
