const express = require('express');

const router = express.Router();

const FriendCtr = require('../controllers/friends');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtr.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtr.UnFollowUser);

module.exports = router;
