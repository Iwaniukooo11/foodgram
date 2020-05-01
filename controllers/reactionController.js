const Reaction = require('./../models/reactionModel')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const factory = require('./handlerFactory')

exports.getAllReactions = factory.getAll(Reaction)

exports.createReaction = factory.createOne(Reaction)

exports.getReaction = factory.getOne(Reaction)

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
