import { Request, Response } from 'express'
import receitasRepository from '../repositories/receitasRepository'
import ingredientesRepository from '../repositories/ingredientesRepository'
import Ingrediente from '../models/Ingrediente'
import Receita from '../models/Receita'
import Preparo from '../models/Preparo'
import preparoRepository from '../repositories/preparoRepository'

type createPreparoDTO = Omit<Preparo, 'id'>
type createIngredienteDTO = Omit<Ingrediente, 'id'>
type createReceitaDTO = Omit<Receita, 'id'>

export default class ReceitasController {
  async create(request: Request, response: Response) {
    try {
      const {
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        imagem,
        ingredientes,
      }: createReceitaDTO = request.body

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!titulo)
        return response.status(400).json({ message: 'O título é obrigatório ' })

      if (!descricao)
        return response
          .status(400)
          .json({ message: 'A descrição é obrigatória ' })

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        imagem,
        ingredientes,
      })

      //To-do: Entender o motivo do problema no lint da linha abaixo
      let novosIngredientes: Array<createIngredienteDTO> = [] // eslint-disable-line
      ingredientes.forEach(ingrediente => {
        const novoIngrediente: createIngredienteDTO = {
          quantidade: ingrediente.quantidade,
          descricao: ingrediente.descricao,
          receita: novaReceita,
        }
        novosIngredientes.push(novoIngrediente)
      })

      //To-do: Entender o motivo do problema no lint da linha abaixo
      let novaListaPreparo: Array<createPreparoDTO> = [] // eslint-disable-line
      listaPreparo.forEach(preparo => {
        const novoPreparo: createPreparoDTO = {
          ordem: preparo.ordem,
          descricao: preparo.descricao,
          receita: novaReceita,
        }
        novaListaPreparo.push(novoPreparo)
      })

      if (novaReceita) await receitasRepository.save(novaReceita)
      if (novaListaPreparo.length > 0)
        await preparoRepository.save(novaListaPreparo)
      if (novosIngredientes.length > 0)
        await ingredientesRepository.save(novosIngredientes)

      return response.status(201).json({ receita: novaReceita })
    } catch (error) {
      return response.status(400).json({ Error: 'Parâmetro não informado' })
    }
  }
}
