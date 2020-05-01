const mongoose = require('mongoose')

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      //  ref: 'User'
    },
    followed: {
      type: mongoose.Schema.ObjectId,
      //  ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
