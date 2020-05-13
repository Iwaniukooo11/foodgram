const catchAsync = require('./../utils/catchAsync')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const Reaction = require('../models/reactionModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')

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
    { desc: 'Followers', num: user.followers, link: 'followers' },
    { desc: 'Follows', num: user.following, link: 'follows' },
  ]
  const posts = await Post.find({ user: user.id })

  res.status(200).render('user', {
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
  let posts = []
  if (orTab)
    posts = await Post.find({ $or: orTab }).sort({ createdAt: 'asc' }).limit(10)

  console.log('POSTS: ', posts)
  res.status(200).render('feed', { posts })
})
exports.getRecent = catchAsync(async (req, res) => {
  const posts = await Post.find().sort({ createdAt: 'asc' }).limit(10)
  res.status(200).render('recent', { posts })
})
exports.getNotifications = catchAsync(async (req, res) => {
  console.log(req.user.id)
  const reactions = await Reaction.find({ postAuthor: req.user.id })
    .sort({ createdAt: 'asc' })
    .limit(10)
  const comments = await Comment.find({ postAuthor: req.user.id })
    .sort({ createdAt: 'asc' })
    .limit(10)

  const notifications = reactions.concat(comments)
  console.log(notifications)
  console.log(reactions, comments)
  res.status(200).render('notifications', { notifications })
})

exports.getUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.userId)
  const stats = [
    { desc: 'Posts', num: user.posts.length },
    { desc: 'Followers', num: user.followers, link: 'followers' },
    { desc: 'Follows', num: user.following, link: 'follows' },
  ]
  const posts = await Post.find({ user: user.id })
  console.log(req.user)
  const isMe = req.user.id === req.params.userId
  if (isMe) return res.redirect('/me')

  // console.log('isme: ', isMe)
  res.status(200).render('user', {
    user,
    isMe,
    stats,
    posts,
  })
})
exports.getPost = catchAsync(async (req, res) => {
  console.log('HERE', req.params.postId)
  const posts = await Post.find({ _id: req.params.postId })
  console.log(posts)
  res.status(200).render('recent', {
    posts,
    isSingle: true,
  })
})
exports.getFollows = catchAsync(async (req, res) => {
  console.log('HERE', req.params.userId)
  const users = await Follow.find({ user: req.params.userId })
  console.log(users)
  res.status(200).render('followList', {
    follows: true,
    users,
  })
})
exports.getFollowers = catchAsync(async (req, res) => {
  const users = await Follow.find({ followed: req.params.userId })
  console.log(users)
  res.status(200).render('followList', {
    followers: true,
    users,
  })
})

exports.getSettings = catchAsync(async (req, res) => {
  res.status(200).render('settings', {
    user: req.user,
  })
})
