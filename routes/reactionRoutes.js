const express = require('express')
const reactionController = require('../controllers/reactionController')
const hanlderFactory = require('../controllers/handlerFactory')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(authController.protect, reactionController.getAllReactions)
  .post(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    reactionController.checkIfUserGaveReaction,
    reactionController.setIdOfPost,
    reactionController.setIdOfPostAuthor,
    reactionController.createReaction
  )
  .delete(
    authController.protect,
    reactionController.setIdOfReactionToRemove,
    reactionController.deleteReaction
  )

router
  .route('/:id')
  .get(authController.protect, reactionController.getReaction)
  .patch(authController.protect, reactionController.updateReaction)
  .delete(authController.protect, reactionController.deleteReaction)

module.exports = router
