const express = require('express')
const commentController = require('../controllers/commentController')
const hanlderFactory = require('../controllers/handlerFactory')

const router = express.Router()

router
  .route('/')
  .get(commentController.getAllComments)
  .post(hanlderFactory.setUserIdAsUser, commentController.createComment)

router
  .route('/:id')
  .get(commentController.getComment)
  .patch(commentController.updateComment)
  .delete(commentController.deleteComment)

module.exports = router
