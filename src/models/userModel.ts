import mongoose from 'mongoose'

// USER SQUEMA
const UserSquema = new mongoose.Schema({
  username: { type: String, required: true, min: 3, max: 255 },
  email: { type: String, required: true, min: 6, max: 255 },
  password: { type: String, required: true, min: 6, max: 255 },
  date: { type: Date, default: Date.now() }
})

// USER MODEL
export const UserModel = mongoose.model('User', UserSquema)

// USER ACTIONS
export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
export const getUserById = (userId: string) => UserModel.findById(userId)
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject())
export const deleteUserById = (userId: string) => UserModel.findOneAndDelete({ _id: userId })
export const updateUserById = (userId: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ _id: userId, values })
