import express from 'express'
import { deleteProduct, getAllProducts, getProduct, updateProduct } from '../controllers/productsController'

export default (router: express.Router) => {
  router.get('/products', getAllProducts)
  router.get('/products/:id', getProduct)
  router.delete('/products/:id', deleteProduct)
  router.patch('/products/:id', updateProduct)
}
