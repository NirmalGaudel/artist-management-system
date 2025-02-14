const express = require('express');
const { register, login } = require('../controllers/authController');
const { userDataValidation, loginValidator } = require('../validators/userValidator');
const router = express.Router();

router.post('/register', userDataValidation, register);
router.post('/login',loginValidator, login);

module.exports = router;