import { Request } from 'express'
import db from '../../utils/dbServer'

export const saveQuiz = async (req: Request, result: Array<object>) => {
  const { theme, time, aCount } = req.body

  const quiz = await db.quiz.create({
    data: {
      theme: theme,
      time: time,
      aCount: aCount,
      questions: result,
    },
  })

  return quiz
}
