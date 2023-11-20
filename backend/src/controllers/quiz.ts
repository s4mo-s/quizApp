import { Request, Response } from 'express'
import { getQuizById } from '../services/quizServices/get'

export const getQuiz = async (req: Request, res: Response) => {
  const quiz = await getQuizById(req)
  return res.status(200).send(quiz)
}
