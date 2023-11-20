import express from 'express'
import { createQuiz } from '../controllers/chat'

const router = express.Router()

router.post('/chat', createQuiz)

export default router
