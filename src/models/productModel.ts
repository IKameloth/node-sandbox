import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: false }
})

export const ProductModel = mongoose.model('Product', ProductSchema)

export const getProducts = () => ProductModel.find()
export const getProductById = (id: string) => ProductModel.findById(id)
export const createProduct = (values: Record<string, any>) =>
  new ProductModel(values).save().then((product) => product.toObject())
export const deleteProductById = (id: string) => ProductModel.findOneAndDelete({ _id: id })
export const updateProductById = (id: string, values: Record<string, any>) =>
  ProductModel.findOneAndUpdate({ _id: id, values })
