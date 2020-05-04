const catchAsync = require('./../utils/catchAsync')

exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', {
    title: 'uirra',
  })
})
