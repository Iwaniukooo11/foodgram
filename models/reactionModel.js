const mongoose = require('mongoose')
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

const Reaction = mongoose.model('Reaction', reactionSchema)

module.exports = Reaction
