import { Schema, model, Document } from "mongoose";

interface IToken extends Document {
  userId: Schema.Types.ObjectId;
  token: string;
  expiryDate: Date;
}

const tokenSchema = new Schema<IToken>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  token: { type: String, required: true },
  expiryDate: { type: Date, required: true },
});

const Token = model<IToken>("Token", tokenSchema);

export default Token;
