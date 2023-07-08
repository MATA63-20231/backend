import Comentario from '../models/Comentario'
import Receita from '../models/Receita'
import Usuario from '../models/Usuario'

import {
  comentarioUsuarioSemSenha,
  responseReceitaDTO,
  usuarioSemSenha,
} from '../util/types'

const convertUsuarioToResponseUsuario = (usuario: Usuario) => {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    nome: usuario.nome,
    email: usuario.email,
  } as usuarioSemSenha
}

const converterListaComentarioToListaResponseComentario = (
  comentarios: Comentario[]
) => {
  let listaReponseComentario: Array<comentarioUsuarioSemSenha> = [] // eslint-disable-line
  comentarios.forEach(comentario => {
    listaReponseComentario.push(
      convertComentarioToResponseComentario(comentario)
    )
  })
  return listaReponseComentario
}

const convertComentarioToResponseComentario = (comentario: Comentario) => {
  return {
    id: comentario.id,
    usuario: convertUsuarioToResponseUsuario(comentario.usuario),
    comentario: comentario.comentario,
    comentarioPai: comentario.comentarioPai,
    temResposta: comentario.temResposta,
    principal: comentario.principal,
  } as unknown as comentarioUsuarioSemSenha
}

export const convertReceitaToResponseReceita = (receita: Receita) => {
  const tempoPreparoHora = (receita.tempoPreparo / 60) | 0

  const tempoPreparoMinuto = receita.tempoPreparo % 60 | 0

  const tempoPreparo = {
    horas: tempoPreparoHora,
    minutos: tempoPreparoMinuto,
  }

  const responseReceita: responseReceitaDTO = {
    id: receita.id,
    titulo: receita.titulo,
    descricao: receita.descricao,
    rendimento: receita.rendimento,
    tempoPreparo: tempoPreparo,
    ingredientes: receita.ingredientes,
    listaPreparo: receita.listaPreparo,
    imagens: receita.imagens,
    dataCadastro: receita.dataCadastro,
    usuario: convertUsuarioToResponseUsuario(receita.usuario),
    curtidas: receita.curtidas,
    comentarios: converterListaComentarioToListaResponseComentario(
      receita.comentarios
    ),
  }

  return responseReceita
}
