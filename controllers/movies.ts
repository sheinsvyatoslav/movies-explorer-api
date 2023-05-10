import { NextFunction, Request, Response } from "express";

import { ForbiddenError } from "../errors/forbidden-error";
import { NotFoundError } from "../errors/not-found-error";
import { ValidationError } from "../errors/validation-error";
import { MovieModel } from "../models/movie";

import { UserRequest } from "./users";

export const getMovies = (req: Request, res: Response, next: NextFunction) => {
  MovieModel.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

export const createMovie = (req: UserRequest, res: Response, next: NextFunction) => {
  const {
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
  } = req.body;

  MovieModel.create({
    movieId,
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
  })
    .then((movie) => res.send(movie))
    .catch((err: Error) => {
      if (err.name === "ValidationError") {
        next(new ValidationError("Переданы некорректные данные при добавлении фильма"));
      } else {
        next(err);
      }
    });
};

export const deleteMovie = (req: UserRequest, res: Response, next: NextFunction) => {
  MovieModel.findById(req.params.movieId)
    .then(async (movie) => {
      if (!movie) {
        next(new NotFoundError("Фильм по указанному id не найден"));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError("Нельзя удалить фильм другого пользователя"));
      }
      return MovieModel.findByIdAndRemove(req.params.movieId).then((delMovie) =>
        res.send(delMovie)
      );
    })
    .catch((err: Error) => {
      if (err.name === "CastError") {
        next(new ValidationError("Передан некорректный id фильма"));
      } else {
        next(err);
      }
    });
};
