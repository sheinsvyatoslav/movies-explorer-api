const router = require('express').Router();
const { vaidateSignup, vaidateSignin } = require('../middlewares/validation');
const { login, createUser } = require('../controllers/users');

router.post('/signup', vaidateSignup, createUser);
router.post('/signin', vaidateSignin, login);

module.exports = router;
