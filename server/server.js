import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connect } from 'mongoose'
import connectDB from './configs/mogodb.js'
import { clerkWebhook } from './controllers/webhooks.js'


//Initialize Express
const app = express()

//connect to database
await connectDB()

//Middlewares
app.use(cors())

//Routes
app.get('/', (req, res) => {
  res.send('Api is running...')
})
app.post('/clerk', express.json(),clerkWebhook )

//port
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})