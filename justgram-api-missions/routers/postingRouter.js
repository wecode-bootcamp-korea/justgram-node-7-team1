const express = require('express')
const validateToken = require('../middlewares/validateToken')
const postingController = require('../controllers/postingController')

const router = express.Router();

router.get('', validateToken, postingController.getPosting)
router.post('', validateToken, postingController.createPosting)

module.exports = {
	postingRouter
}