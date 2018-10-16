const express = require('express');
const router = express.Router();

const PostCrl = require('../controllers/posts');
const AuthHelper = require('../Helpers/AuthHelper');

router.get('/posts', AuthHelper.VerifyToken, PostCrl.GetAllPosts);
router.post('/post/add-post', AuthHelper.VerifyToken, PostCrl.AddPost);

module.exports = router;
