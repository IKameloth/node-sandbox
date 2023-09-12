import express from 'express'
import { deleteUser, getAllUsers, getUser, updateUser } from '../controllers/userController'

export default (router: express.Router) => {
  router.get('/users', getAllUsers)
  router.get('/users/:id', getUser)
  router.delete('/users/:id', deleteUser)
  router.patch('/users/:id', updateUser)
}
