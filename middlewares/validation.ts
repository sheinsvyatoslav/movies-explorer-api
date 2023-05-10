import { celebrate, Joi } from "celebrate";
import mongoose from "mongoose";

export const vaidateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});

export const vaidateCreateMovie = celebrate({
  body: Joi.object().keys({
    movieId: Joi.number().required(),
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string()
      .required()
      .pattern(/http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/),
    trailerLink: Joi.string()
      .required()
      .pattern(/http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/),
    thumbnail: Joi.string()
      .required()
      .pattern(/http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

export const validateMovieId = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (mongoose.Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ message: "Передан некорректный id" });
      }),
  }),
});

export const vaidateSignup = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});

export const vaidateSignin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});
