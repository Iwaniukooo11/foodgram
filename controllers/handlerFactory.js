/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-undef */
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')
const Post = require('../models/postModel')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id)
    console.log('req: ', req.params.id)
    // console.log('DELETING: ', doc, req.user.id)
    // console.log(doc.user.id, req.user.id)

    if (typeof doc.user.id === 'string' && req.user.id) {
      if (doc.user.id !== req.user.id) {
        return next(
          new AppError('removed a doc, that you warent an authorA', 500)
        )
      }
    } else if (doc.user && req.user.id) {
      if (doc.user !== req.user.id) {
        return next(
          new AppError('removed a doc, that you warent an authorB', 500)
        )
      }
    }

    await doc.delete()
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    if (req.updatePost) {
      console.log(req.updatePost.query)
      const test = await Post.findOne(req.updatePost.query)
      console.log('update req', test)
    }

    res.status(204).json({
      status: 'OK',
      data: {
        data: doc,
      },
    })
  })

exports.disactiveOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, {
      isActive: false,
    })
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }
    res.status(204).json({
      status: 'OK',
      data: {
        data: doc,
      },
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) {
      return next(new AppError('No doc found with that ID', 404))
    }

    res.status(200).json({
      status: 'OK',
      data: {
        data: doc,
      },
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)
    console.log('CREATE FROM BODY: ', req.body)

    res.status(201).json({
      status: 'OK',
      data: {
        data: doc,
      },
    })
  })

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    // console.log('\x1b[31m', 'get one: ', req.)
    if (!req.clientData) req.clientData = {}

    let query = req.query.type
      ? Model.findOne({ [req.query.type]: req.params.id })
      : Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)

    const doc = await query

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404))
    }

    // const doc = docs.find(el => el.id === id)
    console.log('\x1b[36m%s\x1b[0m', 'client data:', req.clientData)
    res.status(200).json({
      status: 'OK',
      data: {
        data: { ...doc._doc, ...req.clientData },
      },
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    console.log('\x1b[31m', 'get all: ', Model)

    let filter = {}
    if (req.params.postId) filter = { post: req.params.postId }
    else if (req.params.userId) filter = { nick: req.params.userId }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate()
    // const doc = await features.query.explain()
    const doc = await features.query

    res.status(200).json({
      status: 'OK',
      results: doc.length,
      data: {
        data: doc,
      },
    })
  })

exports.setUserIdAsUser = (req, res, next) => {
  if (req.user.id !== undefined) {
    req.body.user = req.user.id
  }

  next()
}

exports.setUserIdAsParam = (req, res, next) => {
  if (req.user) req.params.id = req.user.id

  next()
}
