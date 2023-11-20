import { Request } from 'express'
import db from '../../utils/dbServer'

export const getUserList = async () => {
  return await db.user.findMany()
}

export const createUser = async (req: Request) => {
  const { username, password, email } = req.body
  const user = await db.user.create({
    data: {
      username: username,
      password: password,
      email: email,
      regDate: new Date(),
    },
  })

  return user
}
