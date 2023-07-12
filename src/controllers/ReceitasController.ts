import { Request, Response } from 'express'
import receitasRepository from '../repositories/receitasRepository'
import ingredientesRepository from '../repositories/ingredientesRepository'
import Receita from '../models/Receita'
import preparoRepository from '../repositories/preparoRepository'
import imagensRepository from '../repositories/imagensRepository'
import * as yup from "yup"

import {
  CreateValidate,
  UpdateValidate,
  IdValidate,
  TituloValidate,
} from "../validates/receitas/index"

const createSchema  = CreateValidate;
const updateSchema  = UpdateValidate;
const idSchema      = IdValidate;
const tituloSchema  = TituloValidate;

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
import usuariosRepository from '../repositories/usuariosRepository'
import { Like } from 'typeorm'

const usuarioId = '9f4afde4-63dd-4565-ad94-f7bfdd1218a6'

export default class ReceitasController {
  async create(request: Request, response: Response) {
    try {
      const reqReceita = request.body
      await createSchema.validate(
        reqReceita, { strict: true }
      );

      const {
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        ingredientes,
      } = reqReceita;

      const listaIngredientes =
        typeof ingredientes == 'string'
          ? JSON.parse(ingredientes)
          : ingredientes
     
      if (!listaIngredientes || listaIngredientes.length < 1)
        return response
          .status(400)
          .json({ message: 'Cadastro de ingredientes é obrigatório.' })

      const tempo: { minutos: number; horas: number } =
        typeof tempoPreparo == 'string'
          ? JSON.parse(tempoPreparo)
          : tempoPreparo
      if (
        !tempo ||
        (!tempo.minutos && !tempo.horas) ||
        (tempo.minutos <= 0 && tempo.horas <= 0)
      )
        return response
          .status(400)
          .json({ message: 'Tempo de preparo deve ser superior a 0.' })

      if (tempo.minutos > 59)
        return response.status(400).json({
          message:
            'Quantidade de minutos para preparo não pode ser superior a 59 minutos.',
        })

      const tempoMinutos =
        (tempo.minutos ? tempo.minutos : 0) +
        (tempo.horas ? tempo.horas * 60 : 0)

      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario)
        return response.status(400).json({
          message: 'Usuário de cadastro não informado',
        })

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
        usuario,
      })

      if (ingredientes.length <= 0)
        return response.status(400).json({
          message: 'Obrigatório o cadastro de ao menos um ingrediente.',
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
          message: 'Obrigatório o cadastro de item para preparo.',
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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json( { 
          error: error.errors.join(', ') } )
      }
      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }

  async edit(request: Request, response: Response) {
    try {
      const { receitaId } = request.params
      const {
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        ingredientes,
      } = request.body
      
      await updateSchema.validate({
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        listaPreparo,
        ingredientes,
        receitaId
      }, { strict: true }
      );

      const listaIngredientes =
        typeof ingredientes == 'string'
          ? JSON.parse(ingredientes)
          : ingredientes
      if (!listaIngredientes || listaIngredientes.length < 1)
        return response
          .status(400)
          .json({ message: 'Cadastro de ingredientes é obrigatório.' })

      if (!rendimento || rendimento == 0)
        return response
          .status(400)
          .json({ message: 'O rendimento deve ser superior a 0.' })

      const tempo: { minutos: number; horas: number } =
        typeof tempoPreparo == 'string'
          ? JSON.parse(tempoPreparo)
          : tempoPreparo
      if (
        !tempo ||
        (!tempo.minutos && !tempo.horas) ||
        (tempo.minutos <= 0 && tempo.horas <= 0)
      )
        return response
          .status(400)
          .json({ message: 'Tempo de preparo deve ser superior a 0.' })

      if (tempo.minutos > 59)
        return response.status(400).json({
          message:
            'Quantidade de minutos para preparo não pode ser superior a 59 minutos.',
        })

      const tempoMinutos =
        (tempo.minutos ? tempo.minutos : 0) +
        (tempo.horas ? tempo.horas * 60 : 0)

      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId },
      })

      if (!usuario)
        return response.status(400).json({
          message: 'Usuário de cadastro não informado',
        })

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo: tempoMinutos,
        usuario,
      })

      if (ingredientes.length <= 0)
        return response.status(400).json({
          message: 'Obrigatório o cadastro de ao menos um ingrediente.',
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
          message: 'Obrigatório o cadastro de item para preparo.',
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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json({ error: error.errors.join(', ') })
      }

      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }

  async findAll(request: Request, response: Response) {
    try {
      const receitas = await receitasRepository.find()

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
      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }

  async findByTitulo(request: Request, response: Response) {
    try {
      const { titulo } = request.body
      await tituloSchema.validate({titulo}, { strict: true })
      
      const receitas = await receitasRepository.find({
        where: { titulo: Like(`%${titulo}%`) },
      })

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
      console.log(error)
      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }

  async findById(request: Request, response: Response) {
    try {
      const { id } = request.params
      await idSchema.validate({id}, { strict: true })

      const receita = await receitasRepository.findOne({ where: { id } })

      if (!receita)
        return response.status(404).json({ Error: 'Registro não encontrado.' })

      const responseReceita = convertReceitaToResponseReceita(receita)

      response.status(200).json(responseReceita)
    } catch (error) {
      console.log(error)
      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params
      await idSchema.validate({id}, { strict: true })

      const receita: Receita | null = await receitasRepository.findOne({
        where: { id },
      })

      if (!receita)
        return response.status(404).json({ Error: 'Registro não encontrado.' })

      await receitasRepository.remove(receita)

      response.status(200).json({ Message: 'Receita apagada com sucesso!' })
    } catch (error) {
      return response.status(400).json({ Error: JSON.stringify(error) })
    }
  }
}
