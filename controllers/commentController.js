const Comment = require('./../models/commentModel')
const factory = require('./handlerFactory')

exports.getAllComments = factory.getAll(Comment)

exports.createComment = factory.createOne(Comment)

exports.getComment = factory.getOne(Comment)

exports.updateComment = factory.updateOne(Comment)

exports.deleteComment = factory.deleteOne(Comment)
