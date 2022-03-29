require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ConflictError = require('../errors/conflict-error');
const UnauthorizedError = require('../errors/unauthorized-error');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('Пользователь не найден'));
      }

      res.send(user);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;

  if (!email || !name) {
    next(new ValidationError('Поля \'email\' и \'name\' должны быть заполнены'));
  }

  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы некорректные данные при обновлении информации о пользователе'));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create(
      {
        email, password: hash, name,
      },
    )
      .then((user) => res.status(200).send({
        email: user.email, name: user.name, _id: user._id,
      }))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Переданы некорректные данные при создании пользователя'));
        }
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже есть'));
        } else next(err);
      }));
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' },
      );
      res.send({ token }).end();
    })
    .catch((err) => {
      next(new UnauthorizedError(err.message));
    });
};
