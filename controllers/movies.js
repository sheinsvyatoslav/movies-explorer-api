const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const ValidationError = require('../errors/validation-error');
const ForbiddenError = require('../errors/forbidden-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail,
  } = req.body;

  Movie.find({})
    .then((movies) => Movie.create({
      movieId: movies.length + 1,
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
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new ValidationError('Переданы некорректные данные при добавлении фильма'));
        } else next(err);
      }))
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        next(new NotFoundError('Фильм по указанному id не найден'));
      }
      if (movie.owner._id.toString() !== req.user._id) {
        next(new ForbiddenError('Нельзя удалить фильм другого пользователя'));
      }
      return Movie.findByIdAndRemove(req.params.movieId).then((delMovie) => res.send(delMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Передан некорректный id фильма'));
      } else next(err);
    });
};
