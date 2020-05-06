const express = require('express')
const commentController = require('../controllers/commentController')
const hanlderFactory = require('../controllers/handlerFactory')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(commentController.getAllComments)
  .post(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    commentController.setIdOfPost,
    commentController.setIdOfPostAuthor,
    commentController.createComment
  )

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(authController.protect, commentController.updateComment)
  .delete(authController.protect, commentController.deleteComment)

module.exports = router
