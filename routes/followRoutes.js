const express = require('express')
const followController = require('../controllers/followController')
const hanlderFactory = require('../controllers/handlerFactory')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(followController.getAllFollows)
  .post(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    followController.addIdToBody,
    followController.checkIfUserGaveFollow,
    followController.createFollow
  )
  .delete(
    authController.protect,
    hanlderFactory.setUserIdAsUser,
    followController.addIdToBody,
    followController.unFollow
  )

router.route('/count').get(
  // authController.protect,
  // hanlderFactory.setUserIdAsUser,
  followController.addIdToBody,
  followController.countFollowers
)

router.route('/:id').get(followController.getFollow)
//   .patch(authController.protect, followController.updateFollow)
//   .delete(authController.protect, followController.deleteFollow)

module.exports = router
