import { Request, Response } from 'express'
import { hash, compare } from 'bcryptjs'
import usuarioRepository from '../repositories/usuariosRepository'

import {
  createUsuarioDTO,
  updateSenhaUsuarioDTO,
  authenticateUsuaroioDTO,
} from '../util/types'
import Usuario from '../models/Usuario'

import { convertUsuarioToResponseUsuario } from '../util/convertToDataType'

export default class UsuarioController {
  async create(request: Request, response: Response) {
    try {
      const {
        usuario,
        nome,
        email,
        senha,
        confirmacaoSenha,
      }: createUsuarioDTO = request.body

      //To-do: Incluir yup para tratamento dos campos obrigatórios de formulário
      if (!usuario)
        return response
          .status(400)
          .json({ message: 'O username é obrigatório' })

      if (!senha || !confirmacaoSenha || senha != confirmacaoSenha)
        return response
          .status(400)
          .json({ message: 'A senha e a confirmação não coincidem' })

      const hashedPassword = await hash(senha, 8)

      const novoUsuario = usuarioRepository.create({
        usuario,
        nome,
        email,
        senha: hashedPassword,
      })

      await usuarioRepository.save(novoUsuario)

      return response
        .status(201)
        .json({ message: 'Usuario criado com sucesso!' })
    } catch (error) {
      return response.status(400).json({ error: error })
      //.json({ message: 'Falha na criação do usuário!' })
    }
  }

  async updateSenha(request: Request, response: Response) {
    try {
      const {
        usuario,
        senhaAtual,
        novaSenha,
        confirmacaoSenha,
      }: updateSenhaUsuarioDTO = request.body

      if (!usuario)
        return response.status(400).json({ message: 'Usuário inválido! ' })

      if (
        !senhaAtual ||
        !novaSenha ||
        !confirmacaoSenha ||
        novaSenha != confirmacaoSenha
      ) {
        return response
          .status(400)
          .json({ message: 'A senha e a confirmação não coincidem' })
      }

      const user = await usuarioRepository.findOne({
        where: {
          usuario: usuario,
        },
      })

      if (!user)
        return response.status(400).json({ message: 'Usuario não encontrado' })

      const passwordValido = await compare(senhaAtual, user.senha)

      if (!passwordValido)
        return response.status(400).json({ message: 'Senha inválida' })

      const hashedPasswordAtual = await hash(novaSenha, 8)

      await usuarioRepository.update(
        {
          usuario,
        },
        {
          senha: hashedPasswordAtual,
        }
      )

      return response
        .status(201)
        .json({ message: 'Senha alterada com sucesso!' })
    } catch (error) {
      return response.status(400).json({ error: error })
      //.json({ message: 'Falha na criação do usuário!' })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params

      const usuario: Usuario | null = await usuarioRepository.findOne({
        where: { id },
      })

      if (!usuario)
        return response.status(404).json({ Error: 'Registro não encontrado' })

      await usuarioRepository.remove(usuario)

      response.status(200).json({ Message: 'Usuario apagado com sucesso!' })
    } catch (error) {
      return response.status(400).json({ Error: error })
    }
  }

  async authenticate(request: Request, response: Response) {
    try {
      const { usuario, senha }: authenticateUsuaroioDTO = request.body

      if (!usuario)
        return response.status(400).json({ message: 'Usuário inválido! ' })

      if (!senha) {
        return response.status(400).json({ message: 'A senha não informada' })
      }

      const user = await usuarioRepository.findOne({
        where: {
          usuario: usuario,
        },
      })

      if (!user)
        return response.status(400).json({ message: 'Usuario não encontrado' })

      const passwordValido = await compare(senha, user.senha)

      if (!passwordValido)
        return response.status(400).json({ message: 'Senha inválida' })

      return response.status(201).json({
        token: user.id,
        usuario: convertUsuarioToResponseUsuario(user),
      })
    } catch (error) {
      return response
        .status(400)
        .json({ message: 'Falha na inclusão do usuário!' })
    }
  }
}
