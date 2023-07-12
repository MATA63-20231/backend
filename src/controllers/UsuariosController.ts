import { Request, Response } from 'express'
import { hash, compare } from 'bcryptjs'
import usuarioRepository from '../repositories/usuariosRepository'

import {
  CreateValidate,
  UpdateValidate,
  DeleteValidate,
  AuthenticateValidate,
} from "../validates/user/index"

import * as yup from "yup"

const  usuarioSchema  = CreateValidate;
const  updateSchema   = UpdateValidate;
const  deleteSchema   = DeleteValidate;
const  authenticateSchema = AuthenticateValidate

import Usuario from '../models/Usuario'

import { convertUsuarioToResponseUsuario } from '../util/convertToDataType'

export default class UsuarioController {
  async create(request: Request, response: Response) {
    try {
      const reqUser = request.body
      await usuarioSchema.validate( 
        reqUser, {strict:true}
        );
      
      const {
        usuario,
        nome,
        email,
        senha,
        confirmacaoSenha,
      } = reqUser;
    

      if (senha != confirmacaoSenha)
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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json( { error: error.errors.join(', ') } )
      }
        return response.status(400).json( {error: error} )

    }
  }

  async updateSenha(request: Request, response: Response) {
    try {
      const reqUser = request.body
      await updateSchema.validate( 
        reqUser, {strict:true}
      );
      
      const {
        usuario,
        senhaAtual,
        novaSenha,
        confirmacaoSenha,
      } = reqUser

      if (
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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json( { error: error.errors.join(', ') } )
      }

      return response.status(400).json({ error: error })
    }
  }

  async delete(request: Request, response: Response) {
    try {
      const { id } = request.params

      await deleteSchema.validate(id, {strict: true})
      const usuario: Usuario | null = await usuarioRepository.findOne({
        where: { id },
      })

      if (!usuario)
        return response.status(404).json({ Error: 'Registro não encontrado' })

      await usuarioRepository.remove(usuario)

      response.status(200).json({ Message: 'Usuario apagado com sucesso!' })
    } catch (error) {
      if(error instanceof yup.ValidationError) {
        return response.status(400).json( { error: error.errors.join(', ') } )
      }

      return response.status(400).json({ error: error })
    }
  }

  async authenticate(request: Request, response: Response) {
    try {
      const { usuario, senha } = request.body

      await authenticateSchema.validate( 
        { usuario, senha }, {strict:true}
      );

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
      if(error instanceof yup.ValidationError) {
        return response.status(400).json( { error: error.errors.join(', ') } )
      }

      return response.status(400).json({ error: error })
    }
  }
}
