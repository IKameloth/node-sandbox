import express from 'express'
import usersRoutes from './usersRoutes'
import productsRoutes from './productsRoutes'
import authRoutes from './authRoutes'

const router = express.Router()

export default (): express.Router => {
  authRoutes(router)
  usersRoutes(router)
  productsRoutes(router)

  return router
}
