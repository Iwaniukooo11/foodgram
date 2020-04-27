const Reaction = require('./../models/reactionModel')
const factory = require('./handlerFactory')

exports.getAllReactions = factory.getAll(Reaction)

exports.createReaction = factory.createOne(Reaction)

exports.getReaction = factory.getOne(Reaction)

exports.updateReaction = factory.updateOne(Reaction)

exports.deleteReaction = factory.deleteOne(Reaction)
