const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')
const followRouter = require('./followRoutes')

const router = express.Router()
router.use('/:id/follows', followRouter)

router.post('/signup', authController.signUp)
router.post('/login', authController.login)
router.get('/logout')
router.get('/me')

router.route('/').get(userController.getAllUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
