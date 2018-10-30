const httpStatus = require('http-status-codes');
const moment = require('moment');
const User = require('../models/userModels');

module.exports = {
  async GetAllUsers(req, res) {
    await User.find({})
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result => {
        res.status(httpStatus.OK).json({ message: 'all users', result });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async GetUser(req, res) {
    await User.findOne({ _id: req.params.id })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result => {
        res.status(httpStatus.OK).json({ message: 'User by id', result });
      })

      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  },

  async GetUserByName(req, res) {
    await User.findOne({ username: req.params.username })
      .populate('posts.postId')
      .populate('following.userFollowed')
      .populate('followers.follower')
      .populate('chatList.receiverId')
      .populate('chatList.msgId')
      .populate('notifications.senderId')
      .then(result => {
        res.status(httpStatus.OK).json({ message: 'User by username', result });
      })
      .catch(err => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err });
      });
  },

  async ProfileView(req, res) {
    const date = moment().format('YYYY-MM-DD');
    await User.update(
      {
        _id: req.body.id,
        'notifications.data': { $ne: [date, ''] },
        'notifications.senderId': { $ne: req.user._id }
      },
      {
        $push: {
          notifications: {
            senderId: req.user._id,
            message: `${req.user.username} View your profile`,
            created: new Date(),
            data: date,
            viewProfile: true
          }
        }
      }
    )
      .then(result => {
        res.status(httpStatus.OK).json({ message: 'Notification sent' });
      })
      .catch(err => {
        res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' });
      });
  }
};
