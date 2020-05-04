const mongoose = require('mongoose')
const User = require('./userModel')
const Comment = require('./commentModel')
const Follow = require('./followModel')
const Reaction = require('./reactionModel')
const AppError = require('./../utils/appError')

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
postSchema.pre(/^find/, async function (next) {
  const postId = this.getQuery()._id

  const allReactions = await Reaction.countDocuments({ post: postId })
  const allComments = await Comment.countDocuments({ post: postId })
  await this.updateOne(
    {},
    { $set: { likesQuantity: allReactions, commentsQuantity: allComments } }
  )

  next()
})

postSchema.pre('save', async function (next) {
  const user = await User.findById(this.user._id)
  if (!user) return next(new AppError('Given user doesnt exist', 404))

  next()
})

postSchema.pre('save', async function (next) {
  console.log(this.user._id, this.id)
  const user = await User.findById(this.user._id)
  user.posts.push(this.id)
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
