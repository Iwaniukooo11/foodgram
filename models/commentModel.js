const mongoose = require('mongoose')
const User = require('./userModel')
const AppError = require('./../utils/appError')

const commentSchema = new mongoose.Schema({
  content: {
    required: [true, 'comment must have a content'],
    type: String,
    maxlength: [230, 'maxlengith in comment max 230!'],
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
})

commentSchema.pre('save', async function (next) {
  const user = await User.findById(this.user)
  if (!user) return next(new AppError('Given user doesnt exist', 404))
  next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
