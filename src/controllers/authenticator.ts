import express from "express";
import { createUser, getUserByEmail } from "../models/userModel";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ResponseBuilder from "../utils/response";
import Token from "../models/tokenModel";
import crypto from "crypto";

const schemaRegister = Joi.object({
  username: Joi.string().min(6).max(255).required(),
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const schemaLogin = Joi.object({
  email: Joi.string().min(6).max(255).required().email(),
  password: Joi.string().min(6).max(255).required(),
});

const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, process.env.SECRET_TOKEN!, { expiresIn: "15m" });
};

const generateRefreshToken = async (userId: string) => {
  const refreshToken = crypto.randomUUID();
  const expiryDate = new Date();

  expiryDate.setDate(expiryDate.getDate() + 1); // 1 Day expiry

  await Token.create({ userId, token: refreshToken, expiryDate });

  return refreshToken;
};

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

    // const salt = await bcrypt.genSalt(10);
    // const passHash = await bcrypt.hash(password, salt);
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
      password,
    });

    const response = new ResponseBuilder<typeof user>()
      .setData(user)
      .setMessage("data fetched successfully")
      .build();

    return res.status(200).json(response).end();
  } catch (error) {
    console.log("register user error =>", error);
    return res.status(500).json(error);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    const { error } = schemaLogin.validate({ email, password });

    if (error) {
      const errorParsed = error.details.map((err) => {
        return {
          message: err.message,
        };
      });

      const response = new ResponseBuilder()
        .setStatus("error")
        .setMessage("validation failed")
        .setErrors(errorParsed)
        .build();

      return res.status(400).json({
        error: response,
      });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      const failureResponse = new ResponseBuilder()
        .setStatus("error")
        .setMessage("validation failed")
        .setErrors([{ message: "user not found" }])
        .build();

      return res.status(404).json(failureResponse);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      // return res.status(400).json({ error: "invalid email or password" });
      const failureResponse = new ResponseBuilder()
        .setStatus("error")
        .setMessage("validation failure")
        .setErrors([{ message: "invalid email or password" }])
        .build();

      return res.status(400).json(failureResponse);
    }

    // const token = jwt.sign(
    //   {
    //     id: user._id,
    //     username: user.username,
    //   },
    //   process.env.SECRET_TOKEN!,
    //   { expiresIn: 3 * 60000 } // * 60000 => 1m
    // );

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = await generateRefreshToken(user._id.toString());

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });

    const response = new ResponseBuilder()
      .setMessage("data fetched successfully")
      .setData({ accessToken })
      .build();

    return res.status(200).json(response).end();
  } catch (error) {
    console.log("login error => ", error);
    return res.sendStatus(500);
  }
};

export const refresh = async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    const response = new ResponseBuilder()
      .setStatus("error")
      .setMessage("validation failed")
      .setErrors([{ message: "refresh token not found" }])
      .build();

    return res.status(401).json(response);
  }

  const tokenDoc = await Token.findOne({ token: refreshToken });

  if (!tokenDoc) {
    const response = new ResponseBuilder()
      .setStatus("error")
      .setMessage("validation error")
      .setErrors([{ message: "invalid refresh token" }])
      .build();
    // return res.status(403).json({ message: "Invalid refresh token" });
    return res.status(403).json(response);
  }

  if (tokenDoc.expiryDate < new Date()) {
    await Token.deleteOne({ token: refreshToken });
    const response = new ResponseBuilder()
      .setStatus("error")
      .setMessage("validation error")
      .setErrors([{ message: "refresh token expired" }])
      .build();
    return res.status(403).json(response);
  }

  const accessToken = generateAccessToken(tokenDoc.userId.toString());

  const successResponse = new ResponseBuilder()
    .setMessage("data fetched successfully")
    .setData({ accessToken })
    .build();

  // res.json({ accessToken });
  res.json(successResponse);
};

export const logout = async (req: express.Request, res: express.Response) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    await Token.deleteOne({ token: refreshToken });
    res.clearCookie("refreshToken");
  }

  res.status(204).send();
};
