import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { authenticator } from '../config/authenticator'

type TokenPayload = {
  iat: number
  exp: number
  sub: string
  permissoes: []
}

export default function verificaAutenticado(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (!authHeader)
    return response.status(400).json({
      message: 'Token não encontrado',
    })

  const [, token] = authHeader.split(' ')

  try {
    if (!authenticator.jwt.secret) {
      return response.status(400).json({
        message: 'Secret não encontrado',
      })
    }

    const decoded = verify(token, authenticator.jwt.secret)

    const { sub } = decoded as TokenPayload

    /*eslint-disable*/
    // @ts-ignore
    request.usuario = { id: sub }
    /*eslint-enable*/
  } catch {
    return response.status(400).json({
      message: 'Token inválido',
    })
  }

  next()
}
