const express = require('express');

const router = express.Router();

const FriendCtr = require('../controllers/friends');
const AuthHelper = require('../Helpers/AuthHelper');

router.post('/follow-user', AuthHelper.VerifyToken, FriendCtr.FollowUser);
router.post('/unfollow-user', AuthHelper.VerifyToken, FriendCtr.UnFollowUser);
router.post('/max/:id', AuthHelper.VerifyToken, FriendCtr.MaxNotification);

router.post('/max-all', AuthHelper.VerifyToken, FriendCtr.MaxAllNotifications);

module.exports = router;
