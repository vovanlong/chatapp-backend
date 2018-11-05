const httpStatus = require('http-status-codes');
const moment = require('moment');
const User = require('../models/userModels');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

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
        console.log(result.notifications);
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
  },

  async ChangePassword(req, res) {
    const schema = Joi.object().keys({
      cpassword: Joi.string().required(),
      newPassword: Joi.string()
        .min(5)
        .required(),
      confirmPassword: Joi.string()
        .min(5)
        .optional()
    });

    const { error, value } = Joi.validate(req.body, schema);
    if (error && error.details) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: error.details });
    }

    const user = await User.findOne({
      _id: req.user._id
    });
    return bcrypt.compare(value.cpassword, user.password).then(async result => {
      if (!result) {
        return res
          .status(httpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Current passowd is inconrrect' });
      }
      const newpassword = await User.EncryptPassword(req.body.newPassword);
      await User.update(
        {
          _id: req.user._id
        },
        {
          password: newpassword
        }
      )
        .then(result => {
          res
            .status(httpStatus.OK)
            .json({ message: 'password changed successfully' });
        })
        .catch(err => {
          res
            .status(httpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
        });
    });
  }
};
