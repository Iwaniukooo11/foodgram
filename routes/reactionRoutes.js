const express = require('express')
const reactionController = require('../controllers/reactionController')
const hanlderFactory = require('../controllers/handlerFactory')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(reactionController.getAllReactions)
  .post(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    reactionController.checkIfUserGaveReaction,
    reactionController.createReaction
  )

router
  .route('/:id')
  .get(reactionController.getReaction)
  .patch(authController.protect, reactionController.updateReaction)
  .delete(authController.protect, reactionController.deleteReaction)

module.exports = router
