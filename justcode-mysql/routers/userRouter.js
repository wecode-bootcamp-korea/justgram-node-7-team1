const express = require("express");
const router = express.Router();
const usercontroller = require("../controller/usercontroller");
// router.get("users", usercontroller.getPost);
//유저 추가
router.post("/join", usercontroller.signup);
//미션 5 유저 로그인
router.post("/login", usercontroller.login);
router.get("/getme", usercontroller.getme);

module.exports = router;
