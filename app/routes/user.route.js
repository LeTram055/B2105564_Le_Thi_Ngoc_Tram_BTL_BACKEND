const express = require('express');
const controller = require('../controllers/user.controller.js');
const middleware = require('../middleware/auth.js')

const router = express.Router();

router.route('/')
    .get(middleware.employeeOrAdminAuth, controller.getAll)
    .post(controller.create)

router.route('/:id')
    .get(controller.getById)
    .put(controller.update)
    .delete(controller.delete)

module.exports = router;