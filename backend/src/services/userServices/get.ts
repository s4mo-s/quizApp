import db from '../../utils/dbServer'

export const getUserList = async () => {
  return await db.user.findMany()
}

export const getUserByUsername = async (username: string) => {
  return await db.user.findUnique({ where: { username: username } })
}

export const getUserByEmail = async (email: string) => {
  return await db.user.findUnique({ where: { email: email } })
}
