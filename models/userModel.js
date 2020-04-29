const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'must have a name!'],
      minlength: [3, 'name minimum 5 chars!'],
      maxlength: [20, 'name maximum 20 chars!'],
    },
    nick: {
      type: String,
      trim: true,
      required: [true, 'must have a nick!'],
      unique: true,
      minlength: [3, 'nick minimum 5 chars!'],
      maxlength: [20, 'nick maximum 20 chars!'],
    },
    email: {
      type: String,
      required: [true, 'user must have an enmail'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'No valid email'],
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
    },
    image: {
      type: String,
      //TD add img
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // TD add posts
    posts: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Post',
        refPath: 'Post',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

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

// userSchema.pre(/^find/, function (next) {
//   console.log('POPULATION')
//   this.populate({
//     path: 'posts',
//     select: '_id',
//     // populate: { path: 'posts' },
//   })
//   next()
// })

// userSchema.pre()

// userSchema.virtual('posts', {
//   ref: 'Post',
//   foreignField: 'user',
//   localField: '_id',
// })

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

const User = mongoose.model('User', userSchema)

module.exports = User
