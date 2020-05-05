const catchAsync = require('./../utils/catchAsync')
const Post = require('../models/postModel')

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
