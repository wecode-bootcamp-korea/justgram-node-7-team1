const express = require('express')
const userController = require('../controllers/userController')

const router = express.Router();

router.post('/join', userController.signUp)

module.exports = router