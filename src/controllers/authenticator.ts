import express from "express";
import { createUser, getUserByEmail } from "../models/userModel";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ResponseBuilder from "../utils/response";

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

export const registerUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, username, password } = req.body;

    const { error } = schemaRegister.validate({ email, username, password });

    if (error) {
      const errors = error.details.map((err) => {
        return {
          field: err.context?.key || null,
          message: err.message,
        };
      });

      const validationResponse = new ResponseBuilder()
        .setStatus("error")
        .setMessage("validation failed")
        .setErrors(errors)
        .build();

      return res.status(400).json(validationResponse);
    }

    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(password, salt);
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      const errorResponse = new ResponseBuilder<null>()
        .setStatus("error")
        .setMessage("validation failed")
        .setErrors([{ field: "email", message: "email already taken" }])
        .build();

      return res.status(400).json(errorResponse);
    }

    const user = await createUser({
      email,
      username,
      password: passHash,
    });

    const response = new ResponseBuilder<typeof user>()
      .setData(user)
      .setMessage("Data fetched successfully")
      .build();

    return res.status(200).json(response).end();
  } catch (error) {
    console.log("register user error =>", error);
    return res.status(400).json(error);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    const { error } = schemaLogin.validate({ email, password });

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) return res.sendStatus(404);

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ error: "invalid email or password" });

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
      },
      process.env.SECRET_TOKEN!,
      { expiresIn: 30 * 30 }
    );

    return res.status(200).json({ user, token }).end();
  } catch (error) {
    console.log("login error => ", error);
    return res.sendStatus(400);
  }
};
