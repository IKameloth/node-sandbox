import express from 'express'
import { deleteUserById, getUserById, getUsers } from '../models/userModel'

export const getAllUsers = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getUsers()

    return res.status(200).json(users)
  } catch (error) {
    console.log('users controller error =>', error)
    return res.sendStatus(400)
  }
}

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const user = await getUserById(id)

    if (!user) return res.sendStatus(404)

    return res.status(200).json(user)
  } catch (error) {
    console.log('get user controller error =>', error)
    return res.sendStatus(400)
  }
}

export const deleteUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    await deleteUserById(id)

    return res.status(204)
  } catch (error) {
    console.log('delete user controller error =>', error)
    return res.sendStatus(400)
  }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { username } = req.body

    if (!username) return res.sendStatus(400)

    const user = await getUserById(id)

    if (!user) return res.sendStatus(400)

    user.username = username
    await user.save()
    return res.status(200).json(user).end()
  } catch (error) {
    console.log('update user controller error =>', error)
    return res.sendStatus(400)
  }
}
