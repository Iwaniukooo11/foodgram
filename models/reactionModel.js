const mongoose = require('mongoose')
const AppError = require('./../utils/appError')

const reactionSchema = new mongoose.Schema(
  {
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
      refPath: 'Post',
      required: [true, 'Reaction must have a post'],
    },
    postAuthor: {
      type: mongoose.Schema.ObjectId,
      refPath: 'User',
      required: [true, 'Reaction must have a postAuthor'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// reactionSchema.virtual('postAuthor', {
//   ref: 'User',
//   foreignField: 'posts',
//   localField: 'post',
// })
// reactionSchema.pre('save', async function (next) {
//   this.populate({
//     path: 'postAuthor',
//     select: 'name',
//   })
// })

reactionSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'nick image',
  })
  next()
})

const Reaction = mongoose.model('Reaction', reactionSchema)

module.exports = Reaction
