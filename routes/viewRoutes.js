const express = require('express')
const viewsController = require('../controllers/viewsController')
const authController = require('../controllers/authController')

const router = express.Router()
router.route('/login').get(viewsController.getLogin)
router.route('/signup').get(viewsController.getRegister)
router.route('/me').get(authController.protect, viewsController.getMe)

module.exports = router
