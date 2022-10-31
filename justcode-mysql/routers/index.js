const express = require("express");
const userRouter = require("./userRouter");
const postRouter = require("./postingrouter");

const router = express.Router();

router.use("/users", userRouter);
router.use("/postings", postRouter);

module.exports = router;
