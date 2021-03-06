const Post = require('./../models/postModel')
const factory = require('./handlerFactory')
const AWS = require('aws-sdk')
const multer = require('multer')
const sharp = require('sharp')
const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')

const multerStorage = multer.memoryStorage()
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else cb(new AppError('not an img!', 400), false)
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadImage = upload.single('image')

exports.resizeImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image found!'))
  console.log('RESIZING IMG', req.file)
  const id = process.env.AWS_ACCES_ID
  const secret = process.env.AWS_ACCES_SECRET
  const bucket_name = 'myfoodgram'
  const s3 = new AWS.S3({
    accessKeyId: id,
    secretAccessKey: secret,
  })

  const adress = 'https://myfoodgram.s3.amazonaws.com/'
  const path = `aws-${req.user.id}-${Date.now()}-post.jpeg`
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
      return new AppError('Sth went wrong')
    }
    console.log('\x1b[36m', `|aws| uploaded user img at ${data.Location}`)
  })

  req.body.image = image

  next()
})

exports.getAllPosts = factory.getAll(Post)

exports.getPost = factory.getOne(Post)

exports.createPost = factory.createOne(Post)

exports.updatePost = factory.updateOne(Post)

exports.deletePost = factory.deleteOne(Post)
