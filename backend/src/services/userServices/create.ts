import bcrypt from 'bcrypt'
import db from '../../utils/dbServer'
import { Request } from 'express'

export const getUserList = async () => {
  return await db.user.findMany()
}

export const createUser = async (req: Request) => {
  const { username, password, email } = req.body
  const encryptedPassword = await bcrypt.hash(password, 10)

  const user = await db.user.create({
    data: {
      username: username,
      password: encryptedPassword,
      email: email,
      regDate: new Date(),
    },
  })

  return user
}
