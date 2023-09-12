import express from 'express'
import { getAllUsers } from '../controllers/userController'

export default (router: express.Router) => {
  router.get('/users', getAllUsers)
}
