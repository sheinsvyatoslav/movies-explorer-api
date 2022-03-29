const router = require('express').Router();
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { vaidateCreateMovie, validateMovieId } = require('../middlewares/validation');

router.get('/', getMovies);
router.post('/', vaidateCreateMovie, createMovie);
router.delete('/:movieId', validateMovieId, deleteMovie);

module.exports = router;
