const catchAsync = require('./../utils/catchAsync')

exports.getTest = catchAsync(async (req, res) => {
  res.status(200).render('test', {
    title: 'test',
  })
})
