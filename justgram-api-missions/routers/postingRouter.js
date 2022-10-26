const express = require('express')
const validateToken = require('../middlewares/validateToken')
const postingController = require('../controllers/postingController')

const router = express.Router();

router.get('', postingController.getPosting)

module.exports = router