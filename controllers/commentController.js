const Comment = require('./../models/commentModel')
const Post = require('./../models/postModel')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')

const factory = require('./handlerFactory')

exports.getAllComments = factory.getAll(Comment)

exports.createComment = catchAsync(async (req, res) => {
  const doc = await Comment.create(req.body)
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

exports.getComment = factory.getOne(Comment)

exports.updateComment = factory.updateOne(Comment)

exports.deleteComment = factory.deleteOne(Comment)
