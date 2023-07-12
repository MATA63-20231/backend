import { hash, compare } from 'bcryptjs'
import usuarioRepository from '../repositories/usuariosRepository'
import { sign } from 'jsonwebtoken'

import { authenticator } from '../config/authenticator'

import { convertUsuarioToResponseUsuario } from '../util/convertToDataType'

import {
  createUsuarioDTO,
  updateSenhaUsuarioDTO,
  authenticateUsuaroioDTO,
} from '../util/types'
import Usuario from '../models/Usuario'

export default class UsuarioController {
  async create({ usuario, nome, email, senha }: createUsuarioDTO) {
    try {
      const hashedPassword = await hash(senha, 8)

      const novoUsuario = usuarioRepository.create({
        usuario,
        nome,
        email,
        senha: hashedPassword,
      })

      await usuarioRepository.save(novoUsuario)

      return convertUsuarioToResponseUsuario(novoUsuario)
    } catch (error) {
      console.log(error)
      throw new Error('Falha na criação de usuário')
    }
  }

  async updateSenha({ usuario, senhaAtual, novaSenha }: updateSenhaUsuarioDTO) {
    try {
      const user = await usuarioRepository.findOne({
        where: {
          usuario: usuario,
        },
      })

      if (!user) throw new Error('Usuario não encontrado')

      const passwordValido = await compare(senhaAtual, user.senha)

      if (!passwordValido) throw new Error('Senha inválida')

      const hashedPasswordAtual = await hash(novaSenha, 8)

      await usuarioRepository.update(
        {
          usuario,
        },
        {
          senha: hashedPasswordAtual,
        }
      )

      return { message: 'Senha alterada com sucesso!' }
    } catch (error) {
      console.log(error)
      throw new Error('Falha na alteração de senha')
    }
  }

  async delete(id: string) {
    try {
      const usuario: Usuario | null = await usuarioRepository.findOne({
        where: { id },
      })

      if (!usuario) throw new Error('Usuário não encontrado')

      await usuarioRepository.remove(usuario)

      return { message: 'Usuário excluído com sucesso!' }
    } catch (error) {
      console.log(error)
      throw new Error('Falha na alteração de senha')
    }
  }

  async authenticate({ usuario, senha }: authenticateUsuaroioDTO) {
    if (!authenticator.jwt.secret) throw new Error('Secret não encontrado')

    const user = await usuarioRepository.findOne({
      where: {
        usuario: usuario,
      },
    })

    if (!user) throw new Error('Falha na autenticação')

    const passwordValido = await compare(senha, user.senha)

    if (!passwordValido) throw new Error('Falha na autenticação')

    const token = sign({}, authenticator.jwt.secret, {
      subject: user.id,
      expiresIn: authenticator.jwt.expiresIn,
    })

    return {
      token: token,
      usuario: convertUsuarioToResponseUsuario(user),
    }
  }
}
