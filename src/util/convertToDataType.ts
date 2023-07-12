import Comentario from '../models/Comentario'
import Curtida from '../models/Curtida'
import Receita from '../models/Receita'
import Usuario from '../models/Usuario'

import {
  comentarioUsuarioSemSenha,
  responseReceitaDTO,
  usuarioSemSenha,
  curtidaReponse,
} from '../util/types'

export const convertUsuarioToResponseUsuario = (usuario: Usuario) => {
  return {
    id: usuario.id,
    usuario: usuario.usuario,
    nome: usuario.nome,
    email: usuario.email,
  } as usuarioSemSenha
}

const converterListaCurtidaToListaResponseCurtida = (curtidas: Curtida[]) => {
  let listaReponseCurtida: curtidaReponse[] = [] // eslint-disable-line
  curtidas.forEach(curtida => {
    listaReponseCurtida.push(convertCurtidaToResponseCurtida(curtida))
  })
  return listaReponseCurtida
}

export const convertCurtidaToResponseCurtida = (curtida: Curtida) => {
  return {
    id: curtida.id,
    curtida: curtida.curtida,
    usuario: convertUsuarioToResponseUsuario(curtida.usuario),
  } as curtidaReponse
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
    respostas: comentario.respostas,
  } as unknown as comentarioUsuarioSemSenha
}

export const convertReceitaToResponseReceita = (
  receita: Receita,
  usuarioId: string | undefined
) => {
  const tempoPreparoHora = (receita.tempoPreparo / 60) | 0

  const tempoPreparoMinuto = receita.tempoPreparo % 60 | 0

  const tempoPreparo = {
    horas: tempoPreparoHora,
    minutos: tempoPreparoMinuto,
  }

  let totalLikes = 0
  let totalDislikes = 0
  let minhaCurtida: boolean | undefined
  for (const curtida of receita.curtidas) {
    if (curtida.usuario && curtida.usuario.id == usuarioId)
      minhaCurtida = curtida.curtida
    if (curtida.curtida) totalLikes++
    else totalDislikes++
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
    curtidas: converterListaCurtidaToListaResponseCurtida(receita.curtidas),
    minhaCurtida: minhaCurtida,
    totalCurtidas: receita.curtidas.length,
    totalLikes: totalLikes,
    totalDislikes: totalDislikes,
    comentarios: converterListaComentarioToListaResponseComentario(
      receita.comentarios
    ),
  }

  return responseReceita
}
