const express = require('express')
const reactionController = require('../controllers/reactionController')

const router = express.Router()

router
  .route('/')
  .get(reactionController.getAllReactions)
  .post(reactionController.createReaction)

router
  .route('/:id')
  .get(reactionController.getReaction)
  .patch(reactionController.updateReaction)
  .delete(reactionController.deleteReaction)

module.exports = router
