const Reaction = require('./../models/reactionModel')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')

const factory = require('./handlerFactory')

exports.getAllReactions = factory.getAll(Reaction)

exports.createReaction = factory.createOne(Reaction)

exports.getReaction = catchAsync(async (req, res) => {
  const doc = await Reaction.create(req.body)
  await Post.findById(req.body.post)
  console.log('CREATE FROM BODY IN COMMENT: ', req.body)

  res.status(201).json({
    status: 'OK',
    data: {
      data: doc,
    },
  })
})

///TODO - FIX THIS AND WORK FROM NESTE
exports.setIdOfPost = catchAsync(async (req, res, next) => {
  // if (req.params.postId)
  req.body.post = req.params.postId
  next()
})
exports.setIdOfPostAuthor = catchAsync(async (req, res, next) => {
  // console.log(await User.findOne({ posts: req.body.post }))
  const author = await User.findOne({ posts: req.body.post })
  req.body.postAuthor = author._id
  // req.body.userAuthor
  next()
})

exports.updateReaction = factory.updateOne(Reaction)

exports.deleteReaction = factory.deleteOne(Reaction)

exports.checkIfUserGaveReaction = catchAsync(async (req, res, next) => {
  const reaction = await Reaction.findOne({
    user: req.user.id,
    post: req.params.postId,
  })

  console.log('REACTION: ', reaction)

  if (reaction) {
    return next(new AppError('you already gave a reaction', 500))
  }

  next()
})
