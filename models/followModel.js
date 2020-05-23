const mongoose = require('mongoose')
const User = require('./userModel')

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Folow must have an user'],
    },
    followed: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Folow must have an followed user'],
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

followSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'followed',
    select: 'nick image id',
  })
  this.populate({
    path: 'user',
    select: 'nick image id',
  })
  next()
})

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
