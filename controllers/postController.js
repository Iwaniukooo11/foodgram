const Post = require('./../models/postModel')
const factory = require('./handlerFactory')

exports.getAllPosts = factory.getAll(Post)

exports.createPost = factory.createOne(Post)

exports.getPost = factory.getOne(Post)

exports.updatePost = factory.updateOne(Post)

exports.deletePost = factory.deleteOne(Post)
