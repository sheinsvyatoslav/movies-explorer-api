import dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { UnauthorizedError } from "../errors/unauthorized-error";

dotenv.config();

const { JWT_SECRET = "dev-secret" } = process.env;

type TokenRequest = {
  token: string | JwtPayload;
} & Request;

export const auth = (req: Request, res: Response, next: NextFunction) => {
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

  (req as TokenRequest).token = payload;

  next();
};
