import { Request, Response, NextFunction } from "express";
import ResponseBuilder from "../utils/response";

const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  const response = new ResponseBuilder<null>()
    .setStatus("error")
    .setMessage("Internal Server Error")
    .build();
  res.status(500).json(response);
};

export default errorHandler;
