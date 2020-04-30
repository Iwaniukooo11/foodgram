const express = require('express')
const reactionController = require('../controllers/reactionController')
const hanlderFactory = require('../controllers/handlerFactory')

const router = express.Router()

router
  .route('/')
  .get(reactionController.getAllReactions)
  .post(hanlderFactory.setUserIdAsUser, reactionController.createReaction)

router
  .route('/:id')
  .get(reactionController.getReaction)
  .patch(reactionController.updateReaction)
  .delete(reactionController.deleteReaction)

module.exports = router
