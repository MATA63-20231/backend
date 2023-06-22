import { Request, Response } from 'express'
import receitasRepository from '../repositories/receitasRepository'
import ingredientesRepository from '../repositories/ingredientesRepository'
import Ingrediente from '../models/Ingrediente'
import Receita from '../models/Receita'
import Preparo from '../models/Preparo'
import preparoRepository from '../repositories/preparoRepository'

type createReceitaDTO = Omit<Omit<Receita, 'id'>, 'tempoPreparo'> & {
  tempoPreparo: {
    horas: number
    minutos: number
  }
}

type createPreparoDTO = Omit<Preparo, 'id'>
type createIngredienteDTO = Omit<Ingrediente, 'id'>

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

      if (ingredientes.length < 1)
        return response
          .status(400)
          .json({ message: 'Cadastro de ingredientes é obrigatório' })

      if (!rendimento || rendimento == 0)
        return response
          .status(400)
          .json({ message: 'O rendimento deve ser superior à 0' })

      let tempoMinutos = 0
      if (tempoPreparo)
        tempoMinutos =
          (tempoPreparo.minutos ? tempoPreparo.minutos : 0) +
          (tempoPreparo.horas ? tempoPreparo.horas * 60 : 0)

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
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
      listaPreparo.forEach((preparo, index) => {
        const novoPreparo: createPreparoDTO = {
          ordem: index,
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

  async findAll(request: Request, response: Response) {
    try {
      const receitas = await receitasRepository
        .createQueryBuilder('receita')
        .innerJoinAndSelect('receita.ingredientes', 'ingredientes')
        .innerJoinAndSelect('receita.listaPreparo', 'listaPreparo')
        .orderBy({
          dataCadastro: 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getMany()
      response.status(200).json(receitas)
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async findByTitulo(request: Request, response: Response) {
    try {
      const { titulo } = request.body

      const receitas = await receitasRepository
        .createQueryBuilder('receita')
        .innerJoinAndSelect('receita.ingredientes', 'ingredientes')
        .innerJoinAndSelect('receita.listaPreparo', 'listaPreparo')
        .where('receita.titulo like :titulo', { titulo: `%${titulo}%` })
        .orderBy({
          dataCadastro: 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getMany()
      response.status(200).json(receitas)
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const { id } = request.params

      const receita = await receitasRepository
        .createQueryBuilder('receita')
        .innerJoinAndSelect('receita.ingredientes', 'ingredientes')
        .innerJoinAndSelect('receita.listaPreparo', 'listaPreparo')
        .where('receita.id = :id', { id: id })
        .orderBy({
          dataCadastro: 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getOne()

      if (!receita)
        return response.status(404).json({ Error: 'Registro não encontrado' })

      response.status(200).json(receita)
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params

      const receita: Receita | null = await receitasRepository.findOne({
        where: { id },
      })

      if (!receita)
        return response.status(404).json({ Error: 'Registro não encontrado' })

      const ingredientes = await ingredientesRepository
        .createQueryBuilder('ingrediente')
        .innerJoin('ingrediente.receita', 'receita')
        .where('ingrediente.receita.id = :idReceita', { idReceita: receita.id })
        .getMany()

      const listaPreparo = await preparoRepository
        .createQueryBuilder('preparo')
        .innerJoin('preparo.receita', 'receita')
        .where('preparo.receita.id = :idReceita', { idReceita: receita.id })
        .getMany()

      if (ingredientes)
        ingredientes.forEach(
          async ingrediente => await ingredientesRepository.remove(ingrediente)
        )

      if (listaPreparo)
        listaPreparo.forEach(
          async preparo => await preparoRepository.remove(preparo)
        )

      await receitasRepository.remove(receita)

      response.status(200).json({ Message: 'Receita apagada com sucesso!' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }
}
