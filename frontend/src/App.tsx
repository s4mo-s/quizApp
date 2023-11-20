import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Home, Login, QuizSetup, Quiz, AuthTest } from './pages'
import { AuthProvider, RequireAuth } from 'react-auth-kit'

function App() {
  return (
    <>
      <AuthProvider
        authType={'cookie'}
        authName={'_auth'}
        cookieDomain={window.location.hostname}
        cookieSecure={false}
      >
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/quizSetup" element={<QuizSetup />} />
            <Route path="/quiz/:id" element={<Quiz />} />
            <Route
              path="/authTest"
              element={
                <RequireAuth loginPath={'/login'}>
                  <AuthTest />
                </RequireAuth>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
