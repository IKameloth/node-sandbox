import express from 'express'
import { deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/productsController'
import { verifyToken } from '../middlewares/verifyToken'

export default (router: express.Router) => {
  router.get('/products', verifyToken, getAllProducts)
  router.get('/products/:id', verifyToken, getProduct)
  router.delete('/products/:id', verifyToken, deleteProduct)
  router.patch('/products/:id', verifyToken, updateProduct)
}
