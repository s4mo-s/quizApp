export interface QuizData {
  questions: QuestionListData[]
  theme: string
  time: number
  aCount: number
}

export interface QuestionListData {
  question: string
  options: string[]
  answers: string[]
}
