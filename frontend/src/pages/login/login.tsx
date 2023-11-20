import { useState } from 'react'
import axios, { AxiosError } from 'axios'
import { useFormik } from 'formik'
import { useSignIn } from 'react-auth-kit'
import { darkTheme } from '../../utils/darkTheme'
import {
  Alert,
  Button,
  Snackbar,
  TextField,
  ThemeProvider,
  Typography,
} from '@mui/material'

type Values = {
  username: string
  password: string
}

export const Login = () => {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const signIn = useSignIn()

  const onSubmit = async (values: Values) => {
    console.log('Login values: ', values)
    setError('')

    try {
      const response = await axios.post('http://localhost:3000/login', values)

      signIn({
        token: response.data.token,
        expiresIn: 3600,
        tokenType: 'Bearer',
        authState: { username: values.username },
      })
      window.location.replace('http://localhost:5173/authTest')
    } catch (err) {
      if (err instanceof AxiosError) {
        err.code == 'ERR_NETWORK'
          ? setError(err.message)
          : setError(err.response?.data.message)
      } else if (err instanceof Error) setError(err.message)

      console.log('Login error: ', err)
      setOpen(true)
    }
  }

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit,
  })

  return (
    <div className={'h-screen flex justify-center items-center'}>
      <div
        className={
          'flex justify-center items-center px-16 py-16 rounded-3xl bg-gray-900'
        }
      >
        <form
          onSubmit={formik.handleSubmit}
          className={'flex flex-col justify-center items-center gap-4'}
        >
          <Typography variant="h4" color="white" gutterBottom>
            Login
          </Typography>
          <ThemeProvider theme={darkTheme}>
            <TextField
              label="Username"
              name="username"
              value={formik.values.username}
              onChange={formik.handleChange}
            />
            <TextField
              label="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
          </ThemeProvider>
          <Button variant="contained" type="submit" sx={{ height: '3rem' }}>
            Login
          </Button>
          <Snackbar
            open={open}
            autoHideDuration={2000}
            onClose={() => setOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        </form>
      </div>
    </div>
  )
}
