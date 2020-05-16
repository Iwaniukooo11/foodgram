const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const followRouter = require('./followRoutes')

const router = express.Router()
router.use('/:id/follows', followRouter)

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.get('/logout', authController.logout)
router.get('/me')
router.patch(
  '/me',
  authController.protect,
  userController.setUserIdToParams,
  userController.updateUser
)

router.route('/').get(userController.getAllUsers)

router
  .route('/:id')
  .get(
    // userController.checkIfIsFollowed,
    userController.getUser
  )
  // .patch(authController.protect, userController.updateUser)
  .delete(authController.protect, userController.deleteUser)

module.exports = router
