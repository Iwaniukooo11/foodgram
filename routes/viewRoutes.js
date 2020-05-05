const express = require('express')
const viewsController = require('../controllers/viewsController')

const router = express.Router()
router.route('/login').get(viewsController.getLogin)

module.exports = router
