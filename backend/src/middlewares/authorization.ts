import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

type Token = {
  id: string
  username: string
  iat: number
  exp: number
}

export const authorization = async (req: Request, res: Response, next: any) => {
  const token = req.cookies.access_token

  if (!process.env.JWT_SECRET) return res.status(500)

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET) as Token
    if (req.body.id && req.body.id !== decodedToken.id) throw 'Invalid user ID'

    req.body.id = decodedToken.id
    return await next()
  } catch (error) {
    return res.status(500).send({ message: 'Token verify error!' })
  }
}
