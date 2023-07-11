import curtidasRepository from '../repositories/curtidasRepository'
import usuariosRepository from '../repositories/usuariosRepository'
import receitasRepository from '../repositories/receitasRepository'

export default class CurtidasController {
  async curtida(receitaId: string, curtida: boolean, usuarioId: string) {
    try {
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

        if (!receita) throw new Error('Receita informada é inválida')

        if (!usuario) throw new Error('Usuário informado é inválido')

        const novaCurtida = curtidasRepository.create({
          usuario: usuario,
          receita: receita,
          curtida: curtida,
        })

        await curtidasRepository.save(novaCurtida)
      }
      return { message: 'Curtida incluida' }
    } catch (error) {
      console.log(error)
      return { message: 'Falha na inclusão da curtida' }
    }
  }

  async delete(receitaId: string, usuarioId: string) {
    try {
      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!receitaId) throw new Error('É obrigatório indicar a receita')

      const curtida = await curtidasRepository
        .createQueryBuilder('curtida')
        .where(
          'curtida.receita.id = :receitaId and curtida.usuario.id = :usuarioId ',
          { receitaId: receitaId, usuarioId: usuarioId }
        )
        .getOne()

      if (!curtida) throw new Error('Curtida não encontrada')

      await curtidasRepository.remove(curtida)

      return { message: 'Curtida removida' }
    } catch (error) {
      console.log(error)
      return { message: 'Falha em remover a curtida' }
    }
  }
}
