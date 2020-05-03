/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable no-undef */
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id)
    doc.delete()
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(204).json({
      status: 'success',
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
      status: 'success',
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
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log('TESTT')

    if (req.params.postId) req.body.post = req.params.postId
    const doc = await Model.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.getOne = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (populateOptions) query = query.populate(populateOptions)

    const doc = await query

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404))
    }

    // const doc = docs.find(el => el.id === id)

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res) => {
    let filter = {}
    if (req.params.postId) filter = { post: req.params.postId }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limit()
      .paginate()
    // const doc = await features.query.explain()
    const doc = await features.query

    res.status(200).json({
      status: 'success',
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
