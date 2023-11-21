import express from 'express'
import signup from './signup'
import user from './user'
import chat from './chat'
import quiz from './quiz'

const router = express.Router()

router.use(signup, user, chat, quiz)

router.get('/', (req, res) => {
  res.json('Main Page')
})

export default router
