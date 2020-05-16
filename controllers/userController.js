const User = require('../models/userModel')
const Reaction = require('../models/reactionModel')
const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

const factory = require('./handlerFactory')

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User, 'posts')

exports.checkIfIsFollowed = catchAsync(async (req, res, next) => {
  // console.log('\x1b[36m', 'start')
  // let follow = null
  // if (req.user)
  //   follow = await Follow.findOne({
  //     user: req.user.id,
  //     followed: req.params.id,
  //   })

  // console.log('FOLLOW: ', follow)
  // req.clientData.isFollowed = !!follow
  next()
})

exports.deleteUser = factory.disactiveOne(User)

exports.updateUser = factory.updateOne(User)

exports.getTotalsPosted = catchAsync(async (req, res, next) => {
  const likes = Reaction.count({ user: req.user.id })
  const comments = Comment.count({ user: req.user.id })
  const posts = Post.count({ user: req.user.id })
  res.status(200).json({
    status: 'OK',
    data: { quantity: { likes, comments, posts } },
  })
})

exports.getTotalsReceived = catchAsync(async (req, res) => {
  //  THIS ROUTE IS NOT DEFINED
})

exports.setUserIdToParams = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

// exports.checkType = catchAsync(async(req,res,next)=>{
//   if (req.query.type==='name'){
//     delete req.query.type
//     req.params.id=
//   }
// })
