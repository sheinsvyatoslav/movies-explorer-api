const router = require('express').Router();
const { getUser, updateUserInfo } = require('../controllers/users');
const { vaidateUpdateUser } = require('../middlewares/validation');

router.get('/', getUser);
router.patch('/', vaidateUpdateUser, updateUserInfo);

module.exports = router;
