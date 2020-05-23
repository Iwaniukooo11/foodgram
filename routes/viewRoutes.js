const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()
router.route('/').get(viewsController.redirect)
router.route('/login').get(viewsController.getLogin)
router.route('/signup').get(viewsController.getRegister)
router.route('/me').get(authController.protect, viewsController.getMe)
router
  .route('/me/settings')
  .get(authController.protect, viewsController.getSettings)
router.route('/feed').get(authController.protect, viewsController.getFeed)
router.route('/recent').get(authController.protect, viewsController.getRecent)
router
  .route('/notifications')
  .get(authController.protect, viewsController.getNotifications)

router
  .route('/users/:userId')
  .get(authController.protect, viewsController.getUser)
router
  .route('/users/:userId/follows')
  .get(authController.protect, viewsController.getFollows)
router
  .route('/users/:userId/followers')
  .get(authController.protect, viewsController.getFollowers)
router
  .route('/posts/:postId')
  .get(authController.protect, viewsController.getPost)

router
  .route('/create-post')
  .get(authController.protect, viewsController.getPostCreator)

module.exports = router
