const mongoose = require('mongoose')
const User = require('./userModel')
const AppError = require('./../utils/appError')

const reactionSchema = new mongoose.Schema({
  reaction: {
    type: String,
    enum: ['like', 'love', 'tasty'],
    required: [true, 'no reaction given!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    //author
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Reaction must have an author'],
  },
  post: {
    type: mongoose.Schema.ObjectId,
    ref: 'Post',
    required: [true, 'Reaction must have a post'],
  },
})

reactionSchema.pre('save', async function (next) {
  const user = await User.findById(this.user)
  if (!user) return next(new AppError('Given user doesnt exist', 404))
  next()
})

const Reaction = mongoose.model('Reaction', reactionSchema)

module.exports = Reaction
