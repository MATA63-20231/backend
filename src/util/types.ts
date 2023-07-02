import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
import Receita from '../models/Receita'

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
