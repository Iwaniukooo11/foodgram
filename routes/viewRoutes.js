const express = require('express')
const viewsController = require('../controllers/viewsController')

const router = express.Router()
router.route('/login').get(viewsController.getLogin)
router.route('/signup').get(viewsController.getRegister)
router.route('/me').get(viewsController.getMe)

module.exports = router
