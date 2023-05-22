import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { UnauthorizedError } from "../errors/unauthorized-error";

dotenv.config();

export type AuthRequest = {
  token: { _id: string };
} & Request;

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET as Secret);
  } catch (err) {
    throw new UnauthorizedError("Необходима авторизация");
  }

  (req as AuthRequest).token = payload as { _id: string };

  next();
};
