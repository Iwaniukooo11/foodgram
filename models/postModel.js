const mongoose = require('mongoose')
const User = require('./userModel')

const postSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      trim: true,
      default: '',
    },
    categories: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],
    image: {
      type: String,
      required: [true, 'must have a cover img'],
      //add img
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    isLive: {
      type: Boolean,
      default: true,
      select: false,
    },
    //add user
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

postSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'nick',
  })
  next()
})

// postSchema.pre('save',function(next){

// })

const Post = mongoose.model('Post', postSchema)

module.exports = Post
