const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const Follow = require('./followModel')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'User must have a name!'],
      minlength: [5, 'Name should have min 5 chars'],
      maxlength: [20, 'Name should have max 20 chars'],
    },
    nick: {
      type: String,
      trim: true,
      required: [true, 'User must have a nick!'],
      unique: true,
      minlength: [3, 'Nick should have min 3 chars'],
      maxlength: [10, 'Nick should have max 10 chars'],
    },
    email: {
      type: String,
      required: [true, 'user must have an enmail'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Invalid email'],
    },
    password: {
      type: String,
      required: [true, 'user must have a password!'],
      minlength: 7,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'user must have a password!!'],
      validate: {
        //ONLY WORKS ON CREATE SAVE
        validator: function (el) {
          return this.password === el
        },
        message: 'passwords are not the same',
      },
    },
    description: {
      type: String,
      default: '',
      maxlength: [50, 'Max description length is 50!'],
    },
    image: {
      type: String,
      default: 'https://image.flaticon.com/icons/svg/17/17004.svg',
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    isLive: {
      type: Boolean,
      default: true,
      select: false,
    },
    following: {
      //<-- user follows them
      type: Number,
      default: 0,
    },
    followers: {
      type: Number, //<--they follow user
      default: 0,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

userSchema.pre(/^find/, async function (next) {
  const followers = await Follow.countDocuments({
    followed: this.getQuery()._id,
  })
  const following = await Follow.countDocuments({ user: this.getQuery()._id })
  await this.updateOne({}, { $set: { followers, following } })

  next()
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  next()
})

userSchema.pre(/^find/, function (next) {
  this.find({ isLive: true })
  next()
})

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
