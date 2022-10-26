const express = require("express");
const userController = require("../controllers/userControllers")

const router = express.Router()

// 유저 회원가입
router.post('/signUp', userController.signUp)

module.exports = router