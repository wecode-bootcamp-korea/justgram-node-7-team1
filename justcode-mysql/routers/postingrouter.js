const express = require("express");
const router = express.Router();
const controller = require("../controller/postingcontroller");

//포스팅 추가
router.post("/posting", controller.posting);
//(전체)게시글 들고오기
router.get("/post", controller.getPost);
//게시글 수정하기
router.patch("/update", controller.update);
// 게시글 삭제
router.delete("/deletePost", controller.deletePost);

module.exports = router;
