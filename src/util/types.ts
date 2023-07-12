import Comentario from '../models/Comentario'
import Curtida from '../models/Curtida'
import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
import Receita from '../models/Receita'
import Usuario from '../models/Usuario'

export type curtidaReponse = Omit<Omit<Curtida, 'usuario'>, 'receita'> & {
  usuario: usuarioSemSenha
}

export type createReceitaDTO = Omit<Omit<Receita, 'id'>, 'tempoPreparo'> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
  usuarioId: string
}

export type createReceitaMultDTO = {
  titulo: string
  descricao: string
  rendimento: number
  tempoPreparo: number
  listaPreparo: Array<Preparo>
  listaIngredientes: Array<Ingrediente>
  usuarioId: { id: string }
  files: fileType[] | undefined
}

export type createImageDTO = {
  receita: Receita
  ordem: number
  nome: string
  data: Buffer
}

export type usuarioSemSenha = Omit<Usuario, 'senha'>

export type comentarioUsuarioSemSenha = Omit<Comentario, 'usuario'> &
  usuarioSemSenha

export type responseReceitaDTO = Omit<
  Omit<Omit<Omit<Receita, 'tempoPreparo'>, 'comentarios'>, 'usuario'>,
  'curtidas'
> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
  comentarios: comentarioUsuarioSemSenha[]
  usuario: usuarioSemSenha
  curtidas: curtidaReponse[]
  minhaCurtida: boolean | undefined
  totalCurtidas: number
  totalLikes: number
  totalDislikes: number
}

export type fileType = {
  originalName: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

export type createPreparoDTO = Omit<Preparo, 'id'>

export type createIngredienteDTO = Omit<Ingrediente, 'id'>

export type createUsuarioDTO = Omit<
  Omit<Omit<Usuario, 'id'>, 'dataCadastro'>,
  'dataAtualizacao'
>

export type updateSenhaUsuarioDTO = {
  usuario: string
  senhaAtual: string
  novaSenha: string
  confirmacaoSenha: string
}

export type authenticateUsuaroioDTO = {
  usuario: string
  senha: string
}

export type responseComentarioDTO = {
  id: string
  comentario: string
  temResposta: boolean
  comentarioPaiId: string
}
