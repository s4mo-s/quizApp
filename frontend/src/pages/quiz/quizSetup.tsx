import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { darkTheme } from '../../utils/darkTheme'
import {
  Alert,
  Backdrop,
  Button,
  CircularProgress,
  MenuItem,
  Slider,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'

type Values = {
  theme: string
  difficulty: string
  time: number
  qCount: number
  oCount: number
  aCount: number
  request: string
}

const difficulty = [
  {
    label: 'Simple',
    value: 'simple',
  },
  {
    label: 'Average',
    value: 'average',
  },
  {
    label: 'Intermediate',
    value: 'intermediate',
  },
  {
    label: 'Advanced',
    value: 'advanced',
  },
]

export const QuizSetup = () => {
  const [openAlert, setOpenAlert] = useState(false)
  const [openBackdrop, setOpenBackdrop] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (values: Values) => {
    console.log('Quiz values: ', values)
    setError('')

    try {
      setOpenBackdrop(true)
      const response = await axios.post('http://localhost:3000/chat', values)
      window.location.replace(`http://localhost:5173/quiz/${response.data.id}`)
    } catch (err) {
      setOpenBackdrop(false)
      if (err instanceof AxiosError) {
        err.code == 'ERR_NETWORK'
          ? setError(err.message)
          : setError(err.response?.data.message)
      } else if (err instanceof Error) setError(err.message)

      console.log('Error in creation: ', err)
      setOpenAlert(true)
    }
  }

  const formik = useFormik({
    initialValues: {
      theme: '',
      difficulty: 'simple',
      time: 10,
      qCount: 10,
      oCount: 4,
      aCount: 1,
      request: '',
    },
    onSubmit,
  })

  return (
    <div className={'h-screen flex justify-center items-center bg-blue-200'}>
      <div
        className={
          'flex justify-center items-center px-32 py-16 rounded-3xl bg-gray-900'
        }
      >
        <Typography variant="h1" color="white" marginRight={15}>
          Generate your QUIZ!
        </Typography>
        <div>
          <Typography
            variant="h5"
            color="white"
            gutterBottom
            sx={{ textAlign: 'center' }}
          >
            Options
          </Typography>
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            <ThemeProvider theme={darkTheme}>
              <TextField
                required
                label="Theme"
                name="theme"
                value={formik.values.theme}
                onChange={formik.handleChange}
              />
              <TextField
                select
                label="Difficulty"
                name="difficulty"
                defaultValue={formik.values.difficulty}
                value={formik.values.difficulty}
                onChange={formik.handleChange}
              >
                {difficulty.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Typography color="white">Time (minutes)</Typography>
              <Slider
                name="time"
                min={1}
                max={120}
                valueLabelDisplay="auto"
                value={formik.values.time}
                onChange={formik.handleChange}
              />
              <Typography color="white">Question count</Typography>
              <Slider
                name="qCount"
                track={false}
                min={3}
                max={25}
                valueLabelDisplay="auto"
                value={formik.values.qCount}
                onChange={formik.handleChange}
              />
              <Typography color="white">Option count</Typography>
              <Slider
                name="oCount"
                track={false}
                marks
                min={2}
                max={10}
                valueLabelDisplay="auto"
                value={formik.values.oCount}
                onChange={formik.handleChange}
              />
              <Typography color="white">Correct answer count</Typography>
              <Slider
                name="aCount"
                track={false}
                marks
                min={1}
                max={5}
                valueLabelDisplay="auto"
                value={formik.values.aCount}
                onChange={formik.handleChange}
              />
              <TextField
                multiline
                maxRows={4}
                label="Special request"
                name="request"
                value={formik.values.request}
                onChange={formik.handleChange}
              />
            </ThemeProvider>
            <Button variant="contained" type="submit">
              Create
            </Button>
          </form>
        </div>
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
        <Backdrop open={openBackdrop}>
          <CircularProgress size="15rem" />
        </Backdrop>
      </div>
    </div>
  )
}
