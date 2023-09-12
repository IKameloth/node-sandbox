import express from 'express'
import { getProducts } from '../models/productModel'

export const getAllProduct = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getProducts()

    return res.status(200).json(users)
  } catch (error) {
    console.log('users controller error =>', error)
    return res.sendStatus(400)
  }
}
