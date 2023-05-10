import express from "express";

import { createMovie, deleteMovie, getMovies } from "../controllers/movies";
import { getUser, updateUser } from "../controllers/users";
import { vaidateCreateMovie, vaidateUpdateUser, validateMovieId } from "../middlewares/validation";

const router = express.Router();

router.get("/users/me", getUser);
router.patch("/users/me", vaidateUpdateUser, updateUser);
router.get("/movies", getMovies);
router.post("/movies", vaidateCreateMovie, createMovie);
router.delete("/movies/:movieId", validateMovieId, deleteMovie);

export default router;
