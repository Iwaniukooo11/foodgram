const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
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
  },
  isLive: {
    type: Boolean,
    default: true,
    select: false,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  //TD add posts
})

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
  // this.passwordConfirm = this.password
  next()
})

userSchema.pre(/^find/, function (next) {
  // if (this.active === null) this.active = true

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
