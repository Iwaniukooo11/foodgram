const express = require('express')
const postController = require('../controllers/postController')
const authController = require('../controllers/authController')
const hanlderFactory = require('../controllers/handlerFactory')

const commentRouter = require('./commentRoutes')

const router = express.Router()
router.use('/:postId/comments', commentRouter)

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

module.exports = router
