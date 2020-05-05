const catchAsync = require('./../utils/catchAsync')

exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', {})
})
exports.getRegister = catchAsync(async (req, res) => {
  res.status(200).render('register', {})
})
exports.getMe = catchAsync(async (req, res) => {
  res.status(200).render('me', {})
})
