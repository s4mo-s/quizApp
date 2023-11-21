import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { getUserByEmail, getUserByUsername } from '../services/userServices/get'
import { createUser } from '../services/userServices/create'

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body

  const loggedUser = await getUserByUsername(username)

  if (!loggedUser)
    return res
      .status(400)
      .send({ message: 'Username or password does not match!' })

  const passwordCorrect = await bcrypt.compare(password, loggedUser.password)

  if (!passwordCorrect)
    return res
      .status(400)
      .send({ message: 'Username or password does not match!' })

  if (!process.env.JWT_SECRET) return res.status(500)

  const jwtToken = jwt.sign(
    {
      id: loggedUser.id,
      email: loggedUser.username,
    },
    process.env.JWT_SECRET
  )

  return res.status(200).send({ message: 'Welcome back!', token: jwtToken })
}

export const registerUser = async (req: Request, res: Response) => {
  const { username, email } = req.body

  const usernameToRegister = await getUserByUsername(username)
  if (usernameToRegister)
    return res.status(400).send({ message: 'Username already exist.' })

  const emailToRegister = await getUserByEmail(email)
  if (emailToRegister)
    return res.status(400).send({ message: 'Email already exist.' })

  const registeredUser = await createUser(req)
  if (!registeredUser) {
    return res.status(500)
  }

  if (!process.env.JWT_SECRET) return res.status(500)

  const jwtToken = jwt.sign(
    {
      id: registeredUser.id,
      email: registeredUser.username,
    },
    process.env.JWT_SECRET
  )

  return res
    .status(200)
    .send({ message: 'Successfully registered.', token: jwtToken })
}
