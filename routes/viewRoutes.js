const express = require('express')
const viewsController = require('../controllers/viewsController')

const router = express.Router()
router.route('/test').get(viewsController.getLogin)

module.exports = router
