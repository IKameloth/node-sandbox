import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

// USER TYPES
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  refreshToken: string;
  // matchPassword: (enteredPassword: string) => Promise<boolean>;
}

// USER SQUEMA
const UserSchema: Schema<IUser> = new Schema(
  {
    username: { type: String, required: true, min: 3, max: 255, unique: true },
    email: { type: String, required: true, min: 6, max: 255, unique: true },
    password: { type: String, required: true, min: 6, max: 255 },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

UserSchema.methods.comparePassword = function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// USER MODEL
export const UserModel = mongoose.model<IUser>("User", UserSchema);

// USER ACTIONS
export const getUsers = () => UserModel.find();
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserById = (userId: string) => UserModel.findById(userId);
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());
export const deleteUserById = (userId: string) =>
  UserModel.findOneAndDelete({ _id: userId });
export const updateUserById = (userId: string, values: Record<string, any>) =>
  UserModel.findOneAndUpdate({ _id: userId, values });
