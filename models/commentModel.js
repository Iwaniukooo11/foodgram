const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
  //TD add user,who commented
  //TD add post
  content: {
    required: [true, 'comment must have a content'],
    type: String,
    maxlength: [230, 'maxlengith in comment max 230!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

const Comment = mongoose.model('Comment', commentSchema)

module.exports = Comment
