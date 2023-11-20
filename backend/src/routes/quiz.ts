import express from 'express'
import { getQuiz } from '../controllers/quiz'

const router = express.Router()

router.get('/quiz/:id', getQuiz)

export default router
