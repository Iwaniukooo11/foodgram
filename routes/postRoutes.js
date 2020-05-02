const express = require('express')
const postController = require('../controllers/postController')
const authController = require('../controllers/authController')
const hanlderFactory = require('../controllers/handlerFactory')

const commentRouter = require('./commentRoutes')
const reactionRouter = require('./reactionRoutes')

const router = express.Router()
router.use('/:postId/comments', commentRouter)
router.use('/:postId/reactions', reactionRouter)

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    postController.createPost
  )

router
  .route('/:id')
  .get(postController.getPost)
  .patch(authController.protect, postController.updatePost)
  .delete(authController.protect, postController.deletePost)

router
  .route('/test')
  .post(
    authController.protect,
    postController.uploadImage,
    postController.resizeImg
  )
module.exports = router
