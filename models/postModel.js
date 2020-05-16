const mongoose = require('mongoose')
const User = require('./userModel')
const Comment = require('./commentModel')
const Reaction = require('./reactionModel')
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
    },

    testCommentsLength: {
      type: Number,
      default: 0,
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
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Post must have an user'],
    },
    likesQuantity: {
      type: Number,
      default: 0,
    },
    commentsQuantity: {
      type: Number,
      default: 0,
    },
    reactions: {
      like: {
        type: Number,
        default: 0,
      },
      love: {
        type: Number,
        default: 0,
      },
      tasty: {
        type: Number,
        default: 0,
      },
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
    select: 'nick _id',
  })
  next()
})

postSchema.post('init', async function (doc) {
  console.log('THIS IS MY DOC!!', doc._id)

  const allReactions = await Reaction.countDocuments({ post: doc._id })
  const allComments = await Comment.countDocuments({ post: doc._id })

  doc.likesQuantity = allReactions
  doc.commentsQuantity = allComments
  console.log('THIS IS LIKES:', allReactions)
  await doc.save()
})
// postSchema.post('remove', async function (doc) {
//   console.log('\x1b[31m','THIS IS MY DOC!!', doc._id)

//   const allReactions = await Reaction.countDocuments({ post: doc._id })
//   const allComments = await Comment.countDocuments({ post: doc._id })

//   doc.likesQuantity = allReactions
//   doc.commentsQuantity = allComments
//   console.log('\x1b[31m','THIS IS LIKES:', allReactions)
//   await doc.save()
// })

postSchema.pre('save', async function (next) {
  console.log(this.user._id, this.id)
  const user = await User.findById(this.user._id)
  if (!user.posts.includes(this.id)) user.posts.push(this.id)
  user.save({ validateBeforeSave: false })
  next()
})
postSchema.pre('remove', async function (next) {
  console.log(this.user._id, this.id)
  const user = await User.findById(this.user._id)
  user.posts = user.posts.filter((id) => id != this.id)
  user.save({ validateBeforeSave: false })

  await Comment.deleteMany({ post: this.id })
  await Reaction.deleteMany({ post: this.id })
  next()
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post
