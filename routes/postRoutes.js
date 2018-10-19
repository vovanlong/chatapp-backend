const express = require('express');
const router = express.Router();

const PostCrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/posts', AuthHelper.VerifyToken, PostCrl.GetAllPosts);
router.get('/post/:id', AuthHelper.VerifyToken, PostCrl.GetPost);

router.post('/post/add-post', AuthHelper.VerifyToken, PostCrl.AddPost);
router.post('/post/add-like', AuthHelper.VerifyToken, PostCrl.AddLike);
router.post('/post/add-comment', AuthHelper.VerifyToken, PostCrl.AddComment);
module.exports = router;
