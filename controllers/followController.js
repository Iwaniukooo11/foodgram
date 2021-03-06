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
    status: 'OK',
    data: {
      data: doc,
    },
  })
})

exports.countAllFollowers = catchAsync(async (req, res) => {
  const followers = await Follow.count({ followed: req.user.id })
  res.status(200).json({
    status: 'OK',
    data: { followers },
  })
})
exports.countAllFollowed = catchAsync(async (req, res) => {
  const followed = await Follow.count({ user: req.user.id })
  res.status(200).json({
    status: 'OK',
    data: { followed },
  })
})

exports.addIdToBody = catchAsync(async (req, res, next) => {
  if (req.params.id) req.body.followed = req.params.id
  next()
})

exports.checkIfUserGaveFollow = catchAsync(async (req, res, next) => {
  const follow = await Follow.findOne(req.body)

  if (follow) {
    return next(new AppError('you already gave a Follow', 500))
  }

  next()
})
