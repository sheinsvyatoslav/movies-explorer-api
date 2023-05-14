import { errors } from "celebrate";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import mongoose from "mongoose";

import { NotFoundError } from "./errors/not-found-error";
import { auth } from "./middlewares/auth";
import { errorHandler } from "./middlewares/errors";
import { errorLogger, requestLogger } from "./middlewares/logger";
import authRouter from "./routers/auth";
import appRouter from "./routers/index";

dotenv.config();

const {
  PORT = 5000,
  DATABASE_URL = "mongodb+srv://sheinsvyatoslav:M8rDvN01WsFqGsm4@cluster0.htt72.mongodb.net/moviesdb?retryWrites=true",
} = process.env;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(authRouter);
app.use(auth);
app.use(appRouter);
app.use(() => {
  throw new NotFoundError("Страница не найдена");
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DATABASE_URL);

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
