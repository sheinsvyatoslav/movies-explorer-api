require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const helmet = require('helmet');
const router = require('./routes/index');
const authentification = require('./routes/auth');
const NotFoundError = require('./errors/not-found-error');
const authorization = require('./middlewares/auth');
const errorHandler = require('./middlewares/errors');

const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 5000, DATABASE_URL = 'mongodb+srv://sheinsvyatoslav:M8rDvN01WsFqGsm4@cluster0.htt72.mongodb.net/moviesdb?retryWrites=true' } = process.env;
const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(requestLogger);
app.use(authentification);
app.use(authorization);
app.use(router);
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.connect(DATABASE_URL);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
