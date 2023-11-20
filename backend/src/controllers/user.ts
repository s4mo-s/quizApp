import { Request, Response } from 'express'
import { getUserList } from '../services/userServices/get'

export const getAllUsers = async (req: Request, res: Response) => {
  const userList = await getUserList()
  return res.status(200).send(userList)
}
