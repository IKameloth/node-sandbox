import express from 'express'
import { createUser, getUserByEmail } from '../models/userModel'
import Joi from 'joi'

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required()
})

export const registerUser = async (req: express.Request, res: express.Response) => {
  try {
    const { email, username, password } = req.body

    const { error } = schemaRegister.validate({ email, username, password })

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      })
    }

    const existingUser = await getUserByEmail(email)

    if (existingUser) {
      return res.status(400).json({ message: 'email already taken' })
    }

    const user = await createUser({
      email,
      username,
      password
    })

    return res.status(200).json(user).end()
  } catch (error) {
    console.log('register user error =>', error)
    return res.status(400).json(error)
  }
}
