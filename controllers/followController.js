const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const Follow = require('../models/followModel')

const factory = require('./handlerFactory')

exports.getAllFollows = factory.getAll(Follow)

exports.createFollow = factory.createOne(Follow)

exports.getFollow = factory.getOne(Follow)

exports.updateFollow = factory.updateOne(Follow)

exports.unFollow = catchAsync(async (req, res, next) => {
  const doc = await Follow.findOne(req.body)
  doc.delete()
  if (!doc) {
    return next(new AppError('No document found with that ID', 404))
  }

  res.status(204).json({
    status: 'success',
    data: {
      data: doc,
    },
  })
})

// exports.countFollowers = catchAsync(async (req, res) => {
//   console.log('COUNT', req.body.followed)
//   const count = await Follow.count({ followed: req.body.followed })
//   res.status(200).json({
//     status: 'OK',
//     data: {
//       data: count,
//     },
//   })
// })

exports.countAllFolowers = catchAsync(async (req, res) => {
  const followers = await Follow.count({ followed: req.user.id })
  res.status(200).json({
    status: 'OK',
    data: { followers },
  })
})
exports.countAllFolowed = catchAsync(async (req, res) => {
  const followed = await Follow.count({ user: req.user.id })
  res.status(200).json({
    status: 'OK',
    data: { followed },
  })
})

exports.addIdToBody = catchAsync(async (req, res, next) => {
  console.log('ADD ID TO BODY', req.params)
  if (req.params.id) req.body.followed = req.params.id
  //   req.b
  next()
})

exports.checkIfUserGaveFollow = catchAsync(async (req, res, next) => {
  const follow = await Follow.findOne(req.body)
  console.log(req.body)

  console.log('Follow: ', follow)

  if (follow) {
    return next(new AppError('you already gave a Follow', 500))
  }
  console.log('HERE WORKS')

  next()
})
