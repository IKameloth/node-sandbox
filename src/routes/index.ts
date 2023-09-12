import express from 'express'
import usersRouter from './usersRouter'

const router = express.Router()

export default (): express.Router => {
  usersRouter(router)

  return router
}
