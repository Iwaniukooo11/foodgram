const catchAsync = require('./../utils/catchAsync')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const Reaction = require('../models/reactionModel')
const Comment = require('../models/commentModel')

exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', {})
})
exports.getRegister = catchAsync(async (req, res) => {
  res.status(200).render('register', {})
})

exports.getMe = catchAsync(async (req, res) => {
  const { user } = req
  const stats = [
    { desc: 'Posts', num: user.posts.length },
    { desc: 'Followers', num: user.followers },
    { desc: 'Follows', num: user.following },
  ]
  const posts = await Post.find({ user: user.id })

  res.status(200).render('me', {
    user: req.user,
    stats,
    posts,
    isMe: true,
  })
})

exports.getFeed = catchAsync(async (req, res) => {
  const following = await Follow.find({ user: req.user.id })
  const orTab = following.map((obj) => {
    return {
      user: obj.followed,
    }
  })

  const posts = await Post.find({ $or: orTab })
    .sort({ createdAt: 'asc' })
    .limit(10)
  console.log('POSTS: ', posts)
  res.status(200).render('feed', { posts })
})
exports.getRecent = catchAsync(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'asc' }).limit(10)
  res.status(200).render('recent', { posts })
})
exports.getNotifications = catchAsync(async (req, res) => {
  const reactions = await Reaction.find().sort({ createdAt: 'asc' }).limit(10)
  const comments = await Comment.find().sort({ createdAt: 'asc' }).limit(10)
  res.status(200).render('recent', { posts })
})
