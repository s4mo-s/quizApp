import { useSignOut } from 'react-auth-kit'
import { Button } from '@mui/material'

export const AuthTest = () => {
  const signOut = useSignOut()

  return (
    <div>
      <h1>You are authorized!</h1>
      <Button variant="contained" onClick={signOut}>
        Logout
      </Button>
    </div>
  )
}
