import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/mogodb.js'
import { clerkWebhook } from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from '@clerk/express'


//Initialize Express
const app = express()

//connect to database
await connectDB()

//Middlewares
app.use(cors())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => {
  res.send('Api is running...')
})
app.post('/clerk', express.json(), clerkWebhook)
app.use('/api/educator', express.json(), educatorRouter)

//port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})