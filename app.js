require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const routerUser = require('./routes/users');
const routerMovies = require('./routes/movies');
const NotFoundError = require('./errors/not-found-error');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { vaidateSignup, vaidateSignin } = require('./middlewares/validation');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const { PORT = 3000 } = process.env;
const app = express();
app.use(cors());
app.use(express.json());

app.use(requestLogger);
app.post('/signup', vaidateSignup, createUser);
app.post('/signin', vaidateSignin, login);
app.use(auth);
app.use('/users/me', routerUser);
app.use('/movies', routerMovies);
app.use(errorLogger);
app.use(errors());
app.use(() => {
  throw new NotFoundError('Страница не найдена');
});
app.use((err, req, res, next) => {
  const { statusCode, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message,
  });
  next();
});

mongoose.connect('mongodb://localhost:27017/bitfilmsdb');

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
