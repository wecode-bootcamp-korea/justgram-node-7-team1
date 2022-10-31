const express = require('express');
const router = express.Router();

const loginRouter = require('./loginRouter');
const userRouter = require('./userRouter');
const postingRouter = require('./postingRouter');

router.use('', loginRouter);
router.use('/user', userRouter);
router.use('/posting', postingRouter);

module.exports = router
