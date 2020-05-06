const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()
router.route('/login').get(viewsController.getLogin)
router.route('/signup').get(viewsController.getRegister)
router.route('/me').get(authController.protect, viewsController.getMe)
router.route('/feed').get(authController.protect, viewsController.getFeed)
router.route('/recent').get(authController.protect, viewsController.getRecent)

module.exports = router
