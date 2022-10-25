const express = require('express');
const router = express.Router();

const {validateToken} = require('../middlewares/validateToken')
const userController = require('../controllers/userController');

// 전체 유저 보여주기
router.get('/allUsers', userController.showAllUser);

// 유저 생성
router.post('/signup', userController.createUser);

// 토큰 확인
router.get('/payload', validateToken, userController.tokenCheck);

module.exports = router