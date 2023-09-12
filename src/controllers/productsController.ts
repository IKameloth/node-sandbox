import express from 'express'
import { deleteProductById, getProductById, getProducts } from '../models/productModel'

export const getAllProducts = async (req: express.Request, res: express.Response) => {
  try {
    const users = await getProducts()

    return res.status(200).json(users)
  } catch (error) {
    console.log('users controller error =>', error)
    return res.sendStatus(400)
  }
}

export const getProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const product = await getProductById(id)
    if (!product) return res.sendStatus(404)

    return res.status(200).json(product)
  } catch (error) {
    return res.sendStatus(400)
  }
}

export const deleteProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params

    const deletedProduct = await deleteProductById(id)
    if (!deleteProduct) return res.sendStatus(404)

    return res.status(204).json(deleteProduct)
  } catch (error) {
    return res.sendStatus(400)
  }
}

export const updateProduct = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    const product = await getProductById(id)

    if (!product) return res.sendStatus(404)

    product.name = name
    product.description = description
    await product.save()

    return res.status(200).json(product).end()
  } catch (error) {
    res.sendStatus(400)
  }
}
