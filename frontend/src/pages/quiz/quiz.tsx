import { useEffect, useState } from 'react'
import { QuizData } from '../../components/quiz/interface/quiz.interface'
import { darkTheme } from '../../utils/darkTheme'
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  ThemeProvider,
  Typography,
} from '@mui/material'
import axios, { AxiosError } from 'axios'
import { useParams } from 'react-router-dom'

export const Quiz = () => {
  const params = useParams()
  const [error, setError] = useState('')
  const [quizStarted, setQuizStart] = useState(false)
  const [quiz, setQuiz] = useState<QuizData>()
  const [selectedOptions, setSelectedOptions] = useState<Array<string[]>>([])
  const [score, setScore] = useState<null | number>(null)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const [openAlert, setOpenAlert] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const getQuiz = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/quiz/${params.id}`
      )
      setQuiz(response.data)
      setMinutes(response.data.time)
    } catch (err) {
      if (err instanceof AxiosError) {
        err.code == 'ERR_NETWORK'
          ? setError(err.message)
          : setError(err.response?.data.message)
      } else if (err instanceof Error) setError(err.message)

      console.log('Error in creation: ', err)
      setOpenAlert(true)
    }
  }

  useEffect(() => {
    getQuiz()
  }, [])

  useEffect(() => {
    if (quizStarted) {
      const timer = setInterval(() => {
        if ((minutes === 0 && seconds === 0) || openDialog) {
          clearInterval(timer)
          handleFinishQuiz()
        } else {
          if (seconds === 0) {
            setMinutes((prevMinutes) => prevMinutes - 1)
            setSeconds(59)
          } else {
            setSeconds((prevSeconds) => prevSeconds - 1)
          }
        }
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [quizStarted, minutes, seconds])

  const handleOptionSelect = (qIndex: number, option: string) => {
    const updatedSelectedOptions = [...selectedOptions]
    let optionIndex = updatedSelectedOptions[qIndex]?.indexOf(option)

    if (optionIndex === undefined) optionIndex = -1

    if (optionIndex === -1) {
      if (selectedOptions[qIndex]?.length >= (quiz?.aCount || 1)) return
      updatedSelectedOptions[qIndex] = [
        ...(updatedSelectedOptions[qIndex] || []),
        option,
      ]
    } else {
      updatedSelectedOptions[qIndex].splice(optionIndex, 1)
    }

    setSelectedOptions(updatedSelectedOptions)
  }

  const handleFinishQuiz = () => {
    let newScore = 0
    quiz?.questions.forEach((question, index) => {
      const correctAnswers = question.answers
      const selected = selectedOptions[index] || []

      if (JSON.stringify(selected) === JSON.stringify(correctAnswers)) {
        newScore++
      }
      setScore(newScore)
      setOpenDialog(true)
    })
  }

  if (!quiz) {
    return (
      <div className={'h-screen flex justify-center items-center bg-blue-200'}>
        <div
          className={
            'w-2/3 p-10 flex flex-col justify-center items-center rounded-3xl gap-2 bg-gray-900'
          }
        >
          <ThemeProvider theme={darkTheme}>
            <Typography variant="h2" color="white">
              Quiz not found...
            </Typography>
          </ThemeProvider>
        </div>
      </div>
    )
  }

  return (
    <>
      {quizStarted === true ? (
        <div className={'h-full min-h-screen flex justify-center bg-blue-200'}>
          <div
            className={
              'h-full w-2/3 p-10 flex flex-col items-center rounded-3xl bg-gray-900'
            }
          >
            <ThemeProvider theme={darkTheme}>
              <div className="sticky w-full top-10">
                <div className="max-w-max p-3 rounded-3xl bg-gray-700">
                  <Typography variant="h6" color="white">
                    {String(minutes).padStart(2, '0')}:
                    {String(seconds).padStart(2, '0')}
                  </Typography>
                </div>
              </div>
              <Typography variant="h2" color="white">
                {quiz.theme} Quiz
              </Typography>
              <Typography variant="h6" color="white" gutterBottom>
                ( Each question got {quiz.aCount} correct answer
                {quiz.aCount === 1 ? '' : 's'} )
              </Typography>
              {quiz.questions.map((question, index) => (
                <div key={index} className="flex flex-col items-center p-4">
                  <Typography variant="h5" color="white">
                    {index + 1}. {question.question}
                  </Typography>
                  {question.options.map((option, oIndex) => (
                    <FormControlLabel
                      key={oIndex}
                      id={`option${index}-${oIndex}`}
                      control={<Checkbox />}
                      label={option}
                      sx={{ color: 'white' }}
                      checked={
                        selectedOptions[index]?.includes(option) || false
                      }
                      onChange={() => handleOptionSelect(index, option)}
                      disabled={
                        selectedOptions[index]?.length === quiz.aCount &&
                        (selectedOptions[index]?.includes(option)
                          ? false
                          : true)
                      }
                    />
                  ))}
                </div>
              ))}
              <Button variant="contained" onClick={handleFinishQuiz}>
                Submit
              </Button>
              {score !== null && (
                <Dialog open={openDialog}>
                  <DialogTitle>
                    Quiz score: {score}/{quiz.questions.length}
                  </DialogTitle>
                </Dialog>
              )}
            </ThemeProvider>
            <Snackbar
              open={openAlert}
              autoHideDuration={2000}
              onClose={() => setOpenAlert(false)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
              <Alert severity="error" sx={{ width: '100%' }}>
                {error}
              </Alert>
            </Snackbar>
          </div>
        </div>
      ) : (
        <div
          className={'h-screen flex justify-center items-center bg-blue-200'}
        >
          <div
            className={
              'w-2/3 p-10 flex flex-col justify-center items-center rounded-3xl gap-2 bg-gray-900'
            }
          >
            <ThemeProvider theme={darkTheme}>
              <Typography variant="h2" color="white" gutterBottom>
                {quiz.theme} Quiz
              </Typography>
              <Typography variant="h6" color="white">
                Time: {quiz.time} minutes
              </Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setQuizStart(true)
                }}
              >
                Start Quiz
              </Button>
            </ThemeProvider>
          </div>
        </div>
      )}
    </>
  )
}
