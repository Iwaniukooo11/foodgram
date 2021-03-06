const express = require('express')
const followController = require('../controllers/followController')
const hanlderFactory = require('../controllers/handlerFactory')
const authController = require('../controllers/authController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(authController.protect, followController.getAllFollows)
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

router
  .route('/count-followers')
  .get(
    authController.protect,
    followController.addIdToBody,
    followController.countAllFollowers
  )
router
  .route('/count-followed')
  .get(
    authController.protect,
    followController.addIdToBody,
    followController.countAllFollowed
  )

router.route('/:id').get(authController.protect, followController.getFollow)

module.exports = router
