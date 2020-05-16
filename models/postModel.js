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
    // testComments: [
    //   {
    //     // type: mongoose.Schema.ObjectId,
    //     // refPath: 'Comment',
    //     ref: 'Comment',
    //   },
    // ],
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

postSchema.pre(/^find/, async function (next) {
  console.log('test-IMG: ', this.image, this.id)
  next()
})

//nie działa
postSchema.pre(/^findOneAnd/, async function (next) {
  const post = await this.findOne()
  this.r = post
  console.log('\x1b[31m', 'still in pre: ', post)
  next()
})

postSchema.pre('save', async function (next) {
  const allReactions = await Reaction.countDocuments({ post: this.id })
  const allComments = await Comment.countDocuments({ post: this.id })
  // console.log('HERE COUNTS!', allReactions, allComments)
  this.likesQuantity = allReactions
  this.commentsQuantity = allComments

  await this.updateOne(
    {},
    { $set: { likesQuantity: allReactions, commentsQuantity: allComments } }
  )

  console.log('\x1b[31m', 'end of pre func', this.commentsQuantity)

  next()
})
postSchema.post(/^findOneAnd/, async function () {
  console.log('\x1b[31m', 'post findoneAnd!')
})

postSchema.post('save', async function (doc) {
  console.log('\x1b[31m', 'post func')
})

postSchema.post('init', async function (doc) {
  console.log('THIS IS MY DOC!!', doc._id)

  const allReactions = await Reaction.countDocuments({ post: doc._id })
  const allComments = await Comment.countDocuments({ post: doc._id })
  // console.log('HERE COUNTS!', allReactions, allComments)
  doc.likesQuantity = allReactions
  doc.commentsQuantity = allComments
  await doc.save()
})
// chyba nie potrzebne
// postSchema.pre('save', async function (next) {
//   const user = await User.findById(this.user._id)
//   if (!user) return next(new AppError('Given user doesnt exist', 404))

//   next()
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
