import { Request, Response } from 'express'
import OpenAI from 'openai'
import { saveQuiz } from '../services/quizServices/create'
import dotenv from 'dotenv'

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const resultExampleData = {
  questions: [
    {
      question: 'What is the largest organ in the human body?',
      options: ['Heart', 'Brain', 'Skin', 'Liver'],
      answers: ['Skin'],
    },
    {
      question: 'Which blood type is considered the universal donor?',
      options: ['A', 'B', 'AB', 'O'],
      answers: ['O'],
    },
  ],
}

const setQuizFunctionSpec = {
  name: 'setQuiz',
  description: 'Sets the questions and answers of quiz',
  parameters: {
    type: 'object',
    properties: {
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: { type: 'string' },
            options: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
            answers: {
              type: 'array',
              items: {
                type: 'string',
              },
            },
          },
          required: ['question', 'options', 'answers'],
        },
      },
    },
    required: ['questions'],
  },
}

const callGPT = async (question: string) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: question }],
    functions: [setQuizFunctionSpec],
    function_call: { name: 'setQuiz' },
  })

  const responseMessage = response.choices[0].message
  console.log('Response: ', response.choices[0].message)

  if (responseMessage.function_call?.name !== 'setQuiz') {
    throw new Error('Wrong function call name.')
  }

  return JSON.parse(responseMessage.function_call.arguments)
}

export const createQuiz = async (req: Request, res: Response) => {
  const { theme, difficulty, qCount, oCount, aCount, request } = req.body

  let question =
    'Create a ' +
    difficulty +
    ' quiz on theme ' +
    theme +
    ', which will consists of ' +
    qCount +
    ' questions with ' +
    oCount +
    ' options each and ' +
    aCount +
    ' correct answers.'
  if (request) {
    const specRequest = ' ' + request + '.'
    question += specRequest
  }
  console.log(question)

  /* const result = await callGPT(question)
  if (!result) return res.status(500)
  console.log('Result: ', result) */

  const newQuiz = await saveQuiz(req, resultExampleData.questions)
  if (!newQuiz) {
    return res.status(400).json({ message: 'Quiz creation failed' })
  }
  return res.status(200).json({ id: newQuiz.id, message: 'Quiz was created' })
}
