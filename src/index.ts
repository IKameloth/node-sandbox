import express from 'express'
import http from 'http'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import routes from './routes'

dotenv.config()

const app = express()
const server = http.createServer(app)

server.listen(process.env.PORT, () => {
  console.info(`Server is running on http://localhost:${process.env.PORT}/`)
})

mongoose.Promise = Promise
mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@mycluster.jieq40j.mongodb.net/?retryWrites=true&w=majority`
)
mongoose.connection.on('connected', () => console.log('connected with mongodb'))
mongoose.connection.on('error', (error) => console.log('error connection with mongodb =>', error))

app.use('/', routes())