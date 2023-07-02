import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
import Receita from '../models/Receita'
import Usuario from '../models/Usuario'

export type createReceitaDTO = Omit<Omit<Receita, 'id'>, 'tempoPreparo'> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
}

export type responseReceitaDTO = Omit<Receita, 'tempoPreparo'> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
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
