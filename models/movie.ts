import mongoose from "mongoose";

const movieSchema = new mongoose.Schema({
  movieId: {
    type: Number,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator(image: string) {
        return /http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/.test(image);
      },
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator(trailerLink: string) {
        return /http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/.test(trailerLink);
      },
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator(thumbnail: string) {
        return /http[s]?:\/\/(www.)?[\S]+\.[a-z]+[\S]*/.test(thumbnail);
      },
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
});

export const MovieModel = mongoose.model("movie", movieSchema);
