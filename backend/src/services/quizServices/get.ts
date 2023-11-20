import { Request } from 'express'
import db from '../../utils/dbServer'

export const getQuizById = async (req: Request) => {
  return await db.quiz.findUnique({
    where: { id: req.params.id },
  })
}
