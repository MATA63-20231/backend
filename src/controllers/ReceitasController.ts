import receitasRepository from '../repositories/receitasRepository'
import ingredientesRepository from '../repositories/ingredientesRepository'
import Receita from '../models/Receita'
import preparoRepository from '../repositories/preparoRepository'
import imagensRepository from '../repositories/imagensRepository'
import fs from 'fs'

import {
  createReceitaMultDTO,
  createIngredienteDTO,
  createPreparoDTO,
  responseReceitaDTO,
  createImageDTO,
} from '../util/types'
import { convertReceitaToResponseReceita } from '../util/convertToDataType'
import Ingrediente from '../models/Ingrediente'
import Preparo from '../models/Preparo'
import usuariosRepository from '../repositories/usuariosRepository'
import { Like } from 'typeorm'
import Imagem from '../models/Imagem'
import { pathImage } from '../config/multer'

export default class ReceitasController {
  async create({
    titulo,
    descricao,
    rendimento,
    tempoPreparo,
    listaPreparo,
    listaIngredientes,
    usuarioId,
    files,
  }: createReceitaMultDTO) {
    try {
      const usuario = await usuariosRepository.findOne({
        where: { id: usuarioId.id },
      })

      if (!usuario) throw new Error('Usuário não encontrado')

      const novaReceita = receitasRepository.create({
        titulo,
        descricao,
        rendimento,
        tempoPreparo,
        usuario,
      })

      //To-do: Entender o motivo do problema no lint da linha abaixo
      const novosIngredientes: Array<createIngredienteDTO> = [] // eslint-disable-line
      if (listaIngredientes.length > 0)
        for (const ingrediente of listaIngredientes) {
          novosIngredientes.push({
            descricao: ingrediente.descricao,
            receita: novaReceita,
          })
        }

      //To-do: Entender o motivo do problema no lint da linha abaixo
      const novaListaPreparo: Array<createPreparoDTO> = [] // eslint-disable-line
      if (listaPreparo.length > 0) {
        let contador = 0
        for (const preparo of listaPreparo) {
          novaListaPreparo.push({
            ordem: contador++,
            descricao: preparo.descricao,
            receita: novaReceita,
          })
        }
      }

      /* eslint-disable */
      let novasImagens: Array<createImageDTO> = []
      // @ts-ignore
      if (files && files.length > 0) {
        // @ts-ignore
        files.forEach((file, index: number) => {
          const novaImagem: createImageDTO = {
            receita: novaReceita,
            ordem: index,
            // @ts-ignore
            nome: file.filename,
          }
          novasImagens.push(novaImagem)
        })
      }
      /* eslint-enable */

      if (novaReceita) {
        const receitaSalva = await receitasRepository.save(novaReceita)
        if (novaListaPreparo.length > 0)
          await preparoRepository.insert(novaListaPreparo)
        if (novosIngredientes.length > 0)
          await ingredientesRepository.insert(novosIngredientes)
        if (novasImagens.length > 0) await imagensRepository.save(novasImagens)

        const responseReceita = await receitasRepository.findOne({
          where: { id: receitaSalva.id },
        })
        if (responseReceita)
          return convertReceitaToResponseReceita(responseReceita)
      }

      throw new Error('Falha na inclusão da receita')
    } catch (error) {
      console.log(error)
      throw new Error('Falha na inclusão da receita')
    }
  }

  async edit({
    receitaId,
    titulo,
    descricao,
    rendimento,
    tempoPreparo,
    listaPreparo,
    listaIngredientes,
    usuarioId,
    files,
  }: createReceitaMultDTO & { receitaId: string }) {
    const usuario = await usuariosRepository.findOne({
      where: { id: usuarioId.id },
    })

    if (!usuario) throw new Error('Usuário não encontrado')

    if (!receitaId) throw new Error('Receita não encontrada')

    const receita = await receitasRepository.findOne({
      where: { id: receitaId },
    })

    if (!receita) throw new Error('Receita não encontrada')

    if (receita.usuario.id != usuario.id)
      throw new Error('Usuário sem permissão para alterar a receita')

    const receitaAlterada = receitasRepository.create({
      titulo,
      descricao,
      rendimento,
      tempoPreparo,
      usuario,
    })

    //To-do: Entender o motivo do problema no lint da linha abaixo
    let novosIngredientes: Array<createIngredienteDTO> = [] // eslint-disable-line
    listaIngredientes.forEach((ingrediente: Ingrediente) => {
      const novoIngrediente: createIngredienteDTO = {
        descricao: ingrediente.descricao,
        receita: receita,
      }
      novosIngredientes.push(novoIngrediente)
    })

    //To-do: Entender o motivo do problema no lint da linha abaixo
    let novaListaPreparo: Array<createPreparoDTO> = [] // eslint-disable-line
    listaPreparo.forEach((preparo: Preparo, index: number) => {
      const novoPreparo: createPreparoDTO = {
        ordem: index,
        descricao: preparo.descricao,
        receita: receita,
      }
      novaListaPreparo.push(novoPreparo)
    })

    /* eslint-disable */
    let novasImagens: Array<createImageDTO> = []
    // @ts-ignore
    if (files && files.length > 0) {
      // @ts-ignore
      files.forEach((file, index: number) => {
        const novaImagem: createImageDTO = {
          receita: receita,
          ordem: index,
          // @ts-ignore
          nome: file.filename,
        }
        novasImagens.push(novaImagem)
      })
    }
    /* eslint-enable */

    try {
      const imagensAntigas = receita.imagens
      for (const imagem of imagensAntigas) {
        fs.unlink(`${pathImage}/${imagem.nome}`, error => {
          console.log(error)
        })
      }

      preparoRepository
        .createQueryBuilder('preparo')
        .delete()
        .from(Preparo)
        .where('receita_id = :id', { id: receita.id })
        .execute()
      ingredientesRepository
        .createQueryBuilder('ingrediente')
        .delete()
        .from(Ingrediente)
        .where('receita_id = :id', { id: receita.id })
        .execute()
      imagensRepository
        .createQueryBuilder('imagem')
        .delete()
        .from(Imagem)
        .where('receita_id = :id', { id: receita.id })
        .execute()

      Object.assign(receita, receitaAlterada)
      const novaReceitaAlterada = await receitasRepository.save(receita)

      if (novaReceitaAlterada) {
        if (novaListaPreparo.length > 0)
          await preparoRepository.insert(novaListaPreparo)
        if (novosIngredientes.length > 0)
          await ingredientesRepository.insert(novosIngredientes)
        if (novasImagens.length > 0)
          await imagensRepository.insert(novasImagens)

        const responseReceita = await receitasRepository.findOne({
          where: { id: novaReceitaAlterada.id },
        })
        if (responseReceita)
          return convertReceitaToResponseReceita(responseReceita)
      }
      throw new Error('Falha na alteração da receita')
    } catch (error) {
      console.log(error)
      throw new Error('Falha na alteração da receita')
    }
  }

  async findAll() {
    const receitas = await receitasRepository.find()

    if (receitas) {
      const receitasResponse: responseReceitaDTO[] = []

      receitas.forEach(receita => {
        return receitasResponse.push(convertReceitaToResponseReceita(receita))
      })

      return receitasResponse
    } else {
      return []
    }
  }

  async findMine(usuarioId: string) {
    const receitas = await receitasRepository
      .createQueryBuilder('receita')
      .where('receita.usuario.id = :id', { id: usuarioId })
      .getMany()

    if (receitas) {
      const receitasResponse: Receita[] = []

      receitas.forEach(receita => {
        return receitasResponse.push(receita)
      })

      return receitasResponse
    } else {
      return []
    }
  }

  async findByTitulo(titulo: string) {
    const receitas = await receitasRepository.find({
      where: { titulo: Like(`%${titulo}%`) },
    })

    if (receitas) {
      const receitasResponse: responseReceitaDTO[] = []

      receitas.forEach(receita => {
        return receitasResponse.push(convertReceitaToResponseReceita(receita))
      })

      return receitasResponse
    } else {
      return []
    }
  }

  async findById(id: string) {
    try {
      const receita = await receitasRepository.findOne({ where: { id } })

      if (!receita) throw new Error('Registro não encontrado.')

      const responseReceita = convertReceitaToResponseReceita(receita)

      return responseReceita
    } catch (error) {
      console.log(error)
      throw new Error('Registro não encontrado.')
    }
  }

  async delete(id: string) {
    try {
      const receita: Receita | null = await receitasRepository.findOne({
        where: { id },
      })

      if (!receita) throw new Error('Registro não encontrado.')

      await receitasRepository.remove(receita)

      return 'Receita deletada com sucesso!'
    } catch (error) {
      throw new Error('Falha ao excluir receita')
    }
  }
}
