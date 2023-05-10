import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

import "dotenv/config.js";

import { UserRequest } from "../controllers/users";
import { UnauthorizedError } from "../errors/unauthorized-error";

const { JWT_SECRET = "dev-secret" } = process.env;

export default (req: UserRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  req.user = payload;

  next();
};
