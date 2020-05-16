const Comment = require('./../models/commentModel')
const Post = require('./../models/postModel')
const User = require('./../models/userModel')
const catchAsync = require('../utils/catchAsync')

const factory = require('./handlerFactory')

exports.getAllComments = factory.getAll(Comment)

// exports.createComment = factory.createOne(Comment)
exports.createComment = catchAsync(async (req, res) => {
  const doc = await Comment.create(req.body)
  const dupa = await Post.findById(req.body.post)
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

exports.getComment = factory.getOne(Comment)

exports.updateComment = factory.updateOne(Comment)

exports.deleteComment = factory.deleteOne(Comment)
