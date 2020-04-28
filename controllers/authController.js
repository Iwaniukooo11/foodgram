const jwt = require('jsonwebtoken')
const User = require('./../models/userModel')
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync')
const factory = require('./handlerFactory')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

const createsSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
    ),
    secure: false,
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  const userToShow = { ...user }
  userToShow.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: user.nick,
    },
  })
}

exports.signUp = factory.createOne(User)

exports.login = catchAsync(async (req, res, next) => {
  const { nick, password } = req.body
  const candidatePassword = password
  console.log(nick)

  const user = await User.findOne({ nick }).select('+password')
  console.log(user.name)
  if (!user || !(await user.correctPassword(candidatePassword, user.password)))
    return next(new AppError('incorrect nick or password', 401))

  createsSendToken(user, 201, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout')
  res.status(200).json({
    status: 'success',
    data: 'unloged!',
  })
}
