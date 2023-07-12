import { Request, Response, NextFunction } from 'express'
import { verify } from 'jsonwebtoken'

import { authenticator } from '../config/authenticator'

type TokenPayload = {
  iat: number
  exp: number
  sub: string
  permissoes: []
}

export default function verificaUsuarioAtual(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const authHeader = request.headers.authorization

  if (authHeader) {
    const [, token] = authHeader.split(' ')
    try {
      if (authenticator.jwt.secret) {
        const decoded = verify(token, authenticator.jwt.secret)

        const { sub } = decoded as TokenPayload

        /*eslint-disable*/
        // @ts-ignore
        request.usuario = { id: sub }
        /*eslint-enable*/
      }
    } catch (error) {
      console.log(error)
      return next()
    }
  }
  next()
}
