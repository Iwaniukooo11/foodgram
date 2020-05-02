const Post = require('./../models/postModel')
const factory = require('./handlerFactory')
const AWS = require('aws-sdk')
const multer = require('multer')
const sharp = require('sharp')
const catchAsync = require('../utils/catchAsync')

const multerStorage = multer.memoryStorage() //saves in memory because of resize

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true)
  } else cb(new AppError('not an img!', 400), false)
}

const upload = multer({ storage: multerStorage, fileFilter: multerFilter })

exports.uploadImage = upload.single('image')

const id = process.env.AWS_ACCES_ID
const secret = process.env.AWS_ACCES_SECRET
const bucket_name = 'myfoodgram'

const s3 = new AWS.S3({
  accessKeyId: id,
  secretAccessKey: secret,
})

exports.resizeImg = catchAsync(async (req, res, next) => {
  if (!req.file) return next()

  req.body.image = `aws-${req.user.id}-${Date.now()}-post.jpeg`
  req.file.buffer = await sharp(req.file.buffer)
    .resize(100, 100)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })

  const params = {
    Bucket: bucket_name,
    Key: req.body.image,
    Body: req.file.buffer,
    ACL: 'public-read',
  }

  await s3.upload(params, function (err, data) {
    if (err) {
      throw err
    }
    console.log(`File uploaded successfully. ${data.Location}`)
  })
  //   console.log('DOC: ', doc)
  //   const url = s3.getSignedUrl('getObject', {
  //     Bucket: bucket_name,
  //     Key: req.body.image,
  //   })
  //   console.log('URL: ', url)

  res.status(201).json({
    status: 'OK',
  })
})

exports.getAllPosts = factory.getAll(Post)

exports.getPost = factory.getOne(Post)

exports.createPost = factory.createOne(Post)

exports.updatePost = factory.updateOne(Post)

exports.deletePost = factory.deleteOne(Post)
