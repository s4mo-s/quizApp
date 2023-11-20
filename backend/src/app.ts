import express from 'express'
import cors from 'cors'
import routes from './routes/index'

const app = express()
const PORT = 3000

app.use(express.json())
app.use(cors()) // TODO: corsOptions
app.use('/', routes)

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
