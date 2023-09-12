import express from 'express'
import { registerUser } from '../controllers/authenticator'

export default (router: express.Router) => {
  router.post('/auth/register', registerUser)
}
