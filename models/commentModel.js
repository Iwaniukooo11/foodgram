const mongoose = require('mongoose')
const User = require('./userModel')
const Post = require('./postModel')

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
  author: {
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
  const user = await User.findById(this.author)
  if (!user) return next(AppError('Given author doesnt exist', 404))

  const post = await Post.findById(this.post)
  if (!post) return next(AppError('Given post doesnt exist', 404))

  next()
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
