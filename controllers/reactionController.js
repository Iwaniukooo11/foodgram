const Reaction = require('./../models/reactionModel')
const AppError = require('../utils/appError')
const User = require('../models/userModel')
const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')

const factory = require('./handlerFactory')

exports.getAllReactions = factory.getAll(Reaction)

exports.getReaction = factory.getOne(Reaction)

exports.createReaction = catchAsync(async (req, res) => {
  const doc = await Reaction.create(req.body)
  await Post.findById(req.body.post)

  res.status(201).json({
    status: 'OK',
    data: {
      data: doc,
    },
  })
})

exports.setIdOfPost = catchAsync(async (req, res, next) => {
  req.body.post = req.params.postId
  next()
})
exports.setIdOfPostAuthor = catchAsync(async (req, res, next) => {
  const author = await User.findOne({ posts: req.body.post })
  req.body.postAuthor = author._id
  next()
})

exports.updateReaction = factory.updateOne(Reaction)

exports.setIdOfReactionToRemove = catchAsync(async (req, res, next) => {
  const reaction = await Reaction.findOne({
    post: req.params.postId,
    user: req.user.id,
  })
  req.params.id = reaction.id

  req.updatePost = {
    query: {
      _id: req.params.postId,
    },
  }
  next()
})
exports.deleteReaction = factory.deleteOne(Reaction)

exports.checkIfUserGaveReaction = catchAsync(async (req, res, next) => {
  const reaction = await Reaction.findOne({
    user: req.user.id,
    post: req.params.postId,
  })
  if (reaction) {
    return next(new AppError('you already gave a reaction', 500))
  }

  next()
})
