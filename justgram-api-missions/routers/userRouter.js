const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router();

router.post('/join', userController.signUp)
router.post('/login', userController.login)
router.get('/me', userController.getMe)

module.exports = router