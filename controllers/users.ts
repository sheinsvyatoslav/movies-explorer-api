import bcrypt from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import "dotenv/config.js";

import { ConflictError } from "../errors/conflict-error";
import { NotFoundError } from "../errors/not-found-error";
import { UnauthorizedError } from "../errors/unauthorized-error";
import { ValidationError } from "../errors/validation-error";
import { UserModel } from "../models/user";
import { User } from "../models/user";

const { NODE_ENV, JWT_SECRET } = process.env;

export type UserRequest = {
  user: User;
} & Request;

export const getUser = (req: UserRequest, res: Response, next: NextFunction) => {
  UserModel.findOne({ _id: req.user._id }).then((user) => {
    if (!user) {
      next(new NotFoundError("Пользователь не найден"));
    }

    res.send(user);
  });
};

export const updateUser = (req: UserRequest, res: Response, next: NextFunction) => {
  const { email, name } = req.body;

  UserModel.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new ValidationError(
            "Переданы некорректные данные при обновлении информации о пользователе"
          )
        );
      }
      if (err.code === 11000) {
        next(new ConflictError("Нельзя редактировать данные другого пользователя"));
      } else {
        next(err);
      }
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, name } = req.body;

  bcrypt.hash(password, 10).then((hash) =>
    UserModel.create({
      email,
      password: hash,
      name,
    })
      .then((user) => {
        const { email, name, _id } = user;
        res.status(200).send({ email, name, _id });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(new ValidationError("Переданы некорректные данные при создании пользователя"));
        }
        if (err.code === 11000) {
          next(new ConflictError("Пользователь с таким email уже есть"));
        } else {
          next(err);
        }
      })
  );
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return UserModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
        { expiresIn: "7d" }
      );
      res.send({ token }).end();
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
