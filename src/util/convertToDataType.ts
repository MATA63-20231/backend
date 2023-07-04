import Receita from '../models/Receita'

import { responseReceitaDTO } from '../util/types'

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
    usuario: receita.usuario,
  }

  return responseReceita
}
