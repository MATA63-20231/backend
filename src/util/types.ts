import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
import Receita from '../models/Receita'
import Usuario from '../models/Usuario'

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
  tempoPreparo: string
  listaPreparo: string
  ingredientes: string
}

export type createImageDTO = {
  receita: Receita
  ordem: number
  nome: string
}

export type responseReceitaDTO = Omit<Receita, 'tempoPreparo'> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
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

export type createUsuarioDTO = Omit<Usuario, 'id'> & {
  confirmacaoSenha: string
}

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
