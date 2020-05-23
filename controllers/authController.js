const jwt = require('jsonwebtoken')
const { promisify } = require('util')
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
    status: 'OK',
    token,
    data: {
      user: user.nick,
    },
  })
}

exports.signUp = catchAsync(async (req, res, next) => {
  const doc = await User.create(req.body)
  createsSendToken(doc, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { nick, password } = req.body
  const candidatePassword = password

  const user = await User.findOne({ nick }).select('+password')
  if (!user) return next(new AppError('incorrect nick or password', 401))
  if (!(await user.correctPassword(candidatePassword, user.password)))
    return next(new AppError('incorrect nick or password', 401))
  console.log('REQ-COOKIES: ', req.cookies)
  createsSendToken(user, 201, res)
})

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout')
  res.status(200).json({
    status: 'OK',
    data: 'unloged!',
  })
}

exports.protect = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  } else if (req.cookies.jwt) token = req.cookies.jwt

  console.log('token: ', token)
  if (!token) return next(new AppError('y not logged', 401))

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET) //<-- id, issuedAt, issuedAt+90d (exp)

  const currentUser = await User.findById(decoded.id) //<- z tokena dekoduje id usra w mongoose
  if (!currentUser) return next(new AppError('Token no longer exists'))

  res.locals.user = currentUser //<--save to locals
  req.user = currentUser
  console.log('did protect')
  next()
})
