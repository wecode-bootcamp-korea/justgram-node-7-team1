const  express = require('express');
const  userRouter = require('./user.router');
const  middleware = require('../middlewares/middleware');

const router = express.Router();
router.use('', userRouter);
router.use(middleware.errorHandler);

module.exports = router;