import { Request, Response } from 'express'
import receitasRepository from '../repositories/receitasRepository'
import ingredientesRepository from '../repositories/ingredientesRepository'
import Receita from '../models/Receita'
import preparoRepository from '../repositories/preparoRepository'
import imagensRepository from '../repositories/imagensRepository'

import {
  createReceitaMultDTO,
  createIngredienteDTO,
  createPreparoDTO,
  responseReceitaDTO,
  createImageDTO,
  fileType,
} from '../util/types'
import { convertReceitaToResponseReceita } from '../util/convertToDataType'
import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
//import usuariosRepository from '../repositories/usuariosRepository'

export default class ReceitasController {
  async create(request: Request, response: Response) {
    try {
      const {
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        ingredientes,
      }: createReceitaMultDTO = request.body

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!titulo)
        return response.status(400).json({ message: 'O título é obrigatório ' })

      const listaIngredientes =
        typeof ingredientes == 'string'
          ? JSON.parse(ingredientes)
          : ingredientes
      if (listaIngredientes.length < 1)
        return response
          .status(400)
          .json({ message: 'Cadastro de ingredientes é obrigatório' })

      if (!rendimento || rendimento == 0)
        return response
          .status(400)
          .json({ message: 'O rendimento deve ser superior à 0' })

      const tempo: { minutos: number; horas: number } =
        typeof tempoPreparo == 'string'
          ? JSON.parse(tempoPreparo)
          : tempoPreparo
      if (!tempo || (tempo.minutos <= 0 && tempo.horas <= 0))
        return response
          .status(400)
          .json({ message: 'Tempo de preparo deve ser superior à 0' })

      if (tempo.minutos > 59)
        return response.status(400).json({
          message:
            'Quantidade de minutos para preparo não pode ser à 59 minutos',
        })

      const tempoMinutos =
        (tempo.minutos ? tempo.minutos : 0) +
        (tempo.horas ? tempo.horas * 60 : 0)

      /*const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario)
        return response.status(400).json({
          message: 'Usuário de cadastro não informado',
        })*/

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
        //usuario,
      })

      if (ingredientes.length <= 0)
        return response.status(400).json({
          message: 'Obrigatório o cadastro de ao menos um ingrediente',
        })
      //To-do: Entender o motivo do problema no lint da linha abaixo
      let novosIngredientes: Array<createIngredienteDTO> = [] // eslint-disable-line
      listaIngredientes.forEach((ingrediente: Ingrediente) => {
        const novoIngrediente: createIngredienteDTO = {
          descricao: ingrediente.descricao,
          receita: novaReceita,
        }
        novosIngredientes.push(novoIngrediente)
      })

      if (listaPreparo.length <= 0)
        return response.status(400).json({
          message: 'Obrigatório o cadastro de item para preparo',
        })

      const preparo =
        typeof listaPreparo == 'string'
          ? JSON.parse(listaPreparo)
          : listaPreparo
      //To-do: Entender o motivo do problema no lint da linha abaixo
      let novaListaPreparo: Array<createPreparoDTO> = [] // eslint-disable-line
      preparo.forEach((preparo: Preparo, index: number) => {
        const novoPreparo: createPreparoDTO = {
          ordem: index,
          descricao: preparo.descricao,
          receita: novaReceita,
        }
        novaListaPreparo.push(novoPreparo)
      })

      const files = request.files as unknown[] as fileType[]

      let novasImagens: Array<createImageDTO> = [] // eslint-disable-line
      if (files && files.length > 0) {
        files.forEach((file, index: number) => {
          const novaImagem: createImageDTO = {
            receita: novaReceita,
            ordem: index,
            nome: file.filename,
          }
          novasImagens.push(novaImagem)
        })
      }

      if (novaReceita) await receitasRepository.save(novaReceita)
      if (novaListaPreparo.length > 0)
        await preparoRepository.save(novaListaPreparo)
      if (novosIngredientes.length > 0)
        await ingredientesRepository.save(novosIngredientes)
      if (novasImagens.length > 0) await imagensRepository.save(novasImagens)

      const responseReceita = await receitasRepository
        .createQueryBuilder('receita')
        .innerJoinAndSelect('receita.ingredientes', 'ingredientes')
        .innerJoinAndSelect('receita.listaPreparo', 'listaPreparo')
        .leftJoinAndSelect('receita.imagens', 'imagens')
        .where('receita.id = :id', { id: novaReceita.id })
        .orderBy({
          'receita.dataCadastro': 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getOne()

      return response.status(201).json(responseReceita)
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async findAll(request: Request, response: Response) {
    try {
      const receitas = await receitasRepository
        .createQueryBuilder('receita')
        .innerJoinAndSelect('receita.ingredientes', 'ingredientes')
        .innerJoinAndSelect('receita.listaPreparo', 'listaPreparo')
        .leftJoinAndSelect('receita.imagens', 'imagens')
        .orderBy({
          'receita.dataCadastro': 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getMany()
      if (receitas) {
        const receitasResponse: responseReceitaDTO[] = []

        receitas.forEach(receita => {
          return receitasResponse.push(convertReceitaToResponseReceita(receita))
        })

        response.status(200).json(receitasResponse) // eslint-disable-line
      } else {
        response.status(200).json([])
      }
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
        .leftJoinAndSelect('receita.imagens', 'imagens')
        .where('receita.titulo like :titulo', { titulo: `%${titulo}%` })
        .orderBy({
          'receita.dataCadastro': 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getMany()

      if (receitas) {
        const receitasResponse: responseReceitaDTO[] = []

        receitas.forEach(receita => {
          return receitasResponse.push(convertReceitaToResponseReceita(receita))
        })

        response.status(200).json(receitasResponse) // eslint-disable-line
      } else {
        response.status(200).json([])
      }
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
        .leftJoinAndSelect('receita.imagens', 'imagens')
        .where('receita.id = :id', { id: id })
        .orderBy({
          'receita.dataCadastro': 'ASC',
          'listaPreparo.ordem': 'ASC',
        })
        .getOne()

      if (!receita)
        return response.status(404).json({ Error: 'Registro não encontrado' })

      const responseReceita = convertReceitaToResponseReceita(receita)

      response.status(200).json(responseReceita)
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

      await receitasRepository.remove(receita)

      response.status(200).json({ Message: 'Receita apagada com sucesso!' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }
}
