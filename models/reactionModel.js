const mongoose = require('mongoose')
const reactionSchema = new mongoose.Schema({
  //TD add post
  //TD add user,who gave the like
  reaction: {
    type: String,
    enum: ['like', 'love', 'tasty'],
    required: [true, 'no reaction given!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const Reaction = mongoose.model('Reaction', reactionSchema)

module.exports = Reaction
