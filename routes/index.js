const router = require('express').Router();
const { getUser, updateUserInfo } = require('../controllers/users');
const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { vaidateUpdateUser, vaidateCreateMovie, validateMovieId } = require('../middlewares/validation');

router.get('/users/me', getUser);
router.patch('/users/me', vaidateUpdateUser, updateUserInfo);
router.get('/movies', getMovies);
router.post('/movies', vaidateCreateMovie, createMovie);
router.delete('/movies/:movieId', validateMovieId, deleteMovie);

module.exports = router;
