import mongoose from 'mongoose'

// USER SQUEMA
const UserSquema = new mongoose.Schema({
  username: { type: String, required: Boolean },
  email: { type: String, required: Boolean },
  authentication: {
    password: { type: String, required: Boolean, select: Boolean },
    salt: { type: String, select: Boolean },
    sessionToken: { type: String, select: Boolean }
  }
})

// USER MODEL
export const UserModel = mongoose.model('User', UserSquema)

// USER ACTIONS
export const getUsers = () => UserModel.find()
export const getUserByEmail = (email: string) => UserModel.findOne({ email })
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    'authentication.sessionToken': sessionToken
  })
export const getUserById = (userId: string) => UserModel.findById(userId)
export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject())
export const deleteUserById = (userId: string) => UserModel.findOneAndDelete({ _id: userId })
export const updateUserById = (userId: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ _id: userId, values })
