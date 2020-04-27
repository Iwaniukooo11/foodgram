const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
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
  //add comments
  //add likes
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
