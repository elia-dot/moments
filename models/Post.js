const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  text: {
    type: String,
  },
  video: {
    type: String,
    require: true,
  },
  game: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  photo: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      text: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
      name: {
        type: String,
      },
      photo: {
        type: String,
      },
    },
  ],
});

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
  });
  this.populate({
    path: 'comments.user',
    model: 'user',
  });
  next();
});

module.exports = Post = mongoose.model('post', postSchema);
