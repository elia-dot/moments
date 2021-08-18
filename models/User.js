const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    requires: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  photo: {
    type: String,
    default: 'default_o5swuq_loz92g',
  },
  following: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
      },
    },
  ],
  games: {
    type: [String],
    require: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// userSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'following.user',
//     model: 'user',
//   });
//   next();
// });

module.exports = User = mongoose.model('user', userSchema);
