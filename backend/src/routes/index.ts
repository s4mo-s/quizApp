import express from 'express'
import user from './user'
import chat from './chat'
import quiz from './quiz'
import signup from './signup'

const router = express.Router()

router.use(user, chat, quiz, signup)

router.get('/', async (req, res) => {
  res.json('Main Page')
})

export default router
