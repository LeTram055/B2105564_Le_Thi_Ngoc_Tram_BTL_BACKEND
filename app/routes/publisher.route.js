const express = require('express');
const controller = require('../controllers/publisher.controller.js');
const middleware = require('../middleware/auth.js')

const router = express.Router();

router.route('/')
    .get(middleware.employeeOrAdminAuth, controller.getAll)
    .post(middleware.employeeOrAdminAuth, controller.create)

router.route('/:id')
    .get(middleware.employeeOrAdminAuth, controller.getById)
    .put(middleware.employeeOrAdminAuth, controller.update)
    .delete(middleware.employeeOrAdminAuth, controller.delete)

module.exports = router;