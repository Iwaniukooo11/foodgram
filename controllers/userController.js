const User = require('../models/userModel')
const Reaction = require('../models/reactionModel')
const Comment = require('../models/commentModel')
const Post = require('../models/postModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const multer = require('multer')
const AWS = require('aws-sdk')
const sharp = require('sharp')

const factory = require('./handlerFactory')

exports.getAllUsers = factory.getAll(User)

exports.getUser = factory.getOne(User, 'posts')

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

exports.setUserIdToParams = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id
  next()
})

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else cb(new AppError('not an img!', 400), false)
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadImage = upload.single('image')

exports.resizeImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('no imgage selected'))
  const id = process.env.AWS_ACCES_ID
  const secret = process.env.AWS_ACCES_SECRET
  const bucket_name = 'foodgram-users'
  const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: secret,
  })

  const adress = 'https://foodgram-users.s3.eu-north-1.amazonaws.com/'
  const path = `aws-${req.user.id}-${Date.now()}-img.jpeg`
  const image = adress + path

  req.file.buffer = await sharp(req.file.buffer)
    .resize(400, 400)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })

  const params = {
    Bucket: bucket_name,
    Key: path,
    Body: req.file.buffer,
    ACL: 'public-read',
  }

  await s3.upload(params, async (err, data) => {
    if (err) {
      throw err
    }
    console.log('\x1b[36m', `|aws| uploaded user img at ${data.Location}`)
  })

  req.body.image = image
  next()
})
