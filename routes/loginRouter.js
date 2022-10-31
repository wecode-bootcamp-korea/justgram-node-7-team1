const express = require('express');
const router = express.Router();

const loginController = require('../controllers/loginController');

// 로그인하기
router.post('/login', loginController.loginUser);

module.exports = router