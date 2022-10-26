const express = require('express')

const userRouter = require('./userRouter')
const postingRouter = require('./postingRouter')

const router = express.Router();

router.use('/users', userRouter)
router.use('/postings', postingRouter)

module.exports = router