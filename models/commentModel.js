const mongoose = require('mongoose')
const AppError = require('./../utils/appError')

const commentSchema = new mongoose.Schema({
  content: {
    required: [true, 'Comment must have a content'],
    type: String,
    minlength: [5, 'Use min 5 chars!'],
    maxlength: [230, 'Use max 230 chars!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    //author
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Comment must have an author'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Comment must have a post'],
  },
  postAuthor: {
    type: mongoose.Schema.ObjectId,
    refPath: 'User',
    required: [true, 'Comment must have a postAuthor'],
  },
})
commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'nick image id _id',
  })
  next()
})

commentSchema.index({
  post: 1,
  postAuthor: 1,
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
