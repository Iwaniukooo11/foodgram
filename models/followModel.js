const mongoose = require('mongoose')
const User = require('./userModel')

const followSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    followed: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// followSchema.pre('save', async function (next) {
//   const followedUser = await User.findById(this.followed)
//   followedUser.followers += 1
//   console.log('followedUser.follower=', followedUser.follower)
//   followedUser.save({ validateBeforeSave: false })

//   const author = await User.findById(this.user)
//   author.following += 1
//   author.save({ validateBeforeSave: false })
// })

// followSchema.pre('remove', async function (next) {
//   console.log(this.followed)
//   const user = await User.findById(this.followed)
//   user.follows -= 1
//   console.log('user.follows=', user.follows)
//   user.save({ validateBeforeSave: false })

//   const author = await User.findById(this.user)
//   author.following += 1
//   author.save({ validateBeforeSave: false })
// })
followSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'followed',
    select: 'nick image id',
  })
  this.populate({
    path: 'user',
    select: 'nick image id',
  })
  next()
})

const Follow = mongoose.model('Follow', followSchema)

module.exports = Follow
