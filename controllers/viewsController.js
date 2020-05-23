const catchAsync = require('./../utils/catchAsync')
const Post = require('../models/postModel')
const Follow = require('../models/followModel')
const Reaction = require('../models/reactionModel')
const Comment = require('../models/commentModel')
const User = require('../models/userModel')

const prepareDataPost = async (posts, userId, currentUser) => {
  const reactions = posts.map((post) => {
    const reaction = Reaction.findOne({
      post: post.id,
      user: userId,
    })
    return reaction
  })

  await Promise.all(reactions).then((values) => {
    values.forEach((element, i) => {
      if (element) posts[i].isLiked = true
    })
  })

  const commentsToPost = posts.map((post) => Comment.find({ post: post.id }))

  await Promise.all(commentsToPost).then((values) => {
    values.forEach((element, i) => {
      posts[i].testComments = [...element] || []
      posts[i].currentUser = {
        nick: currentUser.nick,
        image: currentUser.image,
        id: currentUser.id,
      }
    })
  })

  return posts
}

exports.getLogin = catchAsync(async (req, res) => {
  res.status(200).render('login', { login: true })
})
exports.getRegister = catchAsync(async (req, res) => {
  res.status(200).render('register', { login: true })
})

exports.getMe = catchAsync(async (req, res) => {
  const { user } = req
  const stats = [
    { desc: 'posts', num: user.posts.length },
    { desc: 'followers', num: user.followers, link: 'followers' },
    { desc: 'follows', num: user.following, link: 'follows' },
  ]
  let posts = await Post.find({ user: user.id }).sort({ createdAt: -1 }).exec()

  posts = await prepareDataPost(posts, req.user.id, req.user)

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
    posts = await Post.find({ $or: orTab }).sort({ createdAt: -1 }).limit(10)

  posts = await prepareDataPost(posts, req.user.id, req.user)
  console.log('before render: ', posts[0])
  res.status(200).render('feed', { posts })
})

exports.getRecent = catchAsync(async (req, res) => {
  let posts = await Post.find().sort({ createdAt: -1 }).limit(10)
  posts = await prepareDataPost(posts, req.user.id, req.user)

  res.status(200).render('recent', { posts })
})

exports.getNotifications = catchAsync(async (req, res) => {
  const reactions = await Reaction.find({ postAuthor: req.user.id })
    .sort({ createdAt: 'desc' })
    .limit(10)
  const comments = await Comment.find({ postAuthor: req.user.id })
    .sort({ createdAt: 'desc' })
    .limit(10)

  const notifications = reactions
    .concat(comments)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  res.status(200).render('notifications', { notifications })
})

exports.getUser = catchAsync(async (req, res) => {
  //finding user
  let user
  if (req.query.type)
    user = await User.findOne({ [req.query.type]: req.params.userId })
  else user = await User.findById(req.params.userId)

  if (req.query.type) user = await User.findById(user.id)

  if (!user)
    res.status(404).json({
      status: 'ERROR',
      message: `Such user doesen't exist!`,
    })
  //managing stats
  const stats = [
    { desc: 'posts', num: user.posts.length },
    { desc: 'followers', num: user.followers, link: 'followers' },
    { desc: 'follows', num: user.following, link: 'follows' },
  ]

  let posts = await Post.find({ user: user.id }).sort({ createdAt: -1 }).exec()

  posts = await prepareDataPost(posts, req.user.id, req.user)
  //is it me?
  const isMe =
    req.user.id === req.params.userId ||
    req.user[req.query.type] === req.params.userId
  if (isMe) return res.redirect('/me')

  let follow = null

  if (req.user)
    follow = await Follow.findOne({
      user: req.user.id,
      followed: user.id,
    })

  user.isFollowed = !!follow

  res.status(200).render('user', {
    user,
    isMe,
    stats,
    posts,
  })
})
exports.getPost = catchAsync(async (req, res) => {
  let posts = await Post.find({ _id: req.params.postId })
  posts = await prepareDataPost(posts, req.user.id, req.user)
  res.status(200).render('recent', {
    posts,
    isSingle: true,
  })
})
exports.getFollows = catchAsync(async (req, res) => {
  const users = await Follow.find({ user: req.params.userId })
  res.status(200).render('followList', {
    follows: true,
    users,
  })
})
exports.getFollowers = catchAsync(async (req, res) => {
  const users = await Follow.find({ followed: req.params.userId })
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
exports.getPostCreator = catchAsync(async (req, res) => {
  res.status(200).render('createPost', {
    user: req.user,
  })
})
