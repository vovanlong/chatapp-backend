const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');

const User = require('../models/userModels');

cloudinary.config({
  cloud_name: 'dkjkd0bob',
  api_key: '414756665572386',
  api_secret: '18Ay8ookmrbVO6TFnCj4FBakkLo'
});

module.exports = {
  UploadImage(req, res) {
    cloudinary.uploader.upload(req.body.image, async result => {
      console.log(result);
      await User.update(
        {
          _id: req.user._id
        },
        {
          $push: {
            images: {
              imgId: result.public_id,
              imgVersion: result.version
            }
          }
        }
      )
        .then(() =>
          res
            .status(HttpStatus.OK)
            .json({ message: 'Image uploaded successfully' })
        )
        .catch(err =>
          res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error uploading image' })
        );
    });
  },

  async SetDefaultImage(req, res) {
    const { imgId, imgVersion } = req.params;

    await User.update(
      {
        _id: req.user._id
      },
      {
        picId: imgId,
        picVersion: imgVersion
      }
    )
      .then(() =>
        res.status(HttpStatus.OK).json({ message: 'Default image set' })
      )
      .catch(err =>
        res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ message: 'Error occured' })
      );
  }
};
