const express = require('express');
const router = express.Router();

const {validateToken} = require('../middlewares/validateToken')
const postingController = require('../controllers/postingController');

// 게시물 보여주기
router.get('/list', validateToken, postingController.getList);

// 게시물 생성
router.post('/posts', validateToken, postingController.createPost);

// 게시글 업데이트
router.post('/update', validateToken, postingController.updatePost);

// 게시글 삭제
router.post('/delete', validateToken, postingController.deletePost);

module.exports = router

