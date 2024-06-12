import express from "express";
import jwt from "jsonwebtoken";
import ResponseBuilder from "../utils/response";

const BEARER = "Bearer ";
// const accessTokenSecret = process.env.SECRET_TOKEN;

interface AuthenticatedRequest extends express.Request {
  user?: any; // Customize this type according to your user data structure
}

export const verifyToken = (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const existsToken = req.headers.authorization?.includes(BEARER);
  if (!existsToken) return res.status(401).json({ error: "unauthorized" });

  try {
    const token = req.headers.authorization?.replace(BEARER, "");
    const decoded = jwt.decode(token!, { complete: true });
    if (!decoded) return res.status(401).json({ error: "unauthorized" });

    jwt.verify(token!, process.env.SECRET_TOKEN!, (error, user) => {
      if (error) {
        const response = new ResponseBuilder()
          .setStatus("error")
          .setMessage("token validation error")
          .setErrors([{ message: error.toString() }])
          .build();

        return res.status(401).json(response);
      }

      req.user = user;
      next();
    });

    // return next()
  } catch (error) {
    return res.sendStatus(401);
  }
};
