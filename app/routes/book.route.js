const express = require('express');
const controller = require('../controllers/book.controller.js');
const middleware = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
    .get(controller.getAll)
    .post(middleware.employeeOrAdminAuth, controller.create)

router.route("/admin")
    .get(middleware.employeeOrAdminAuth, controller.getAll)

router.route('/:id')
    .get(controller.getById)
    .put(middleware.employeeOrAdminAuth, controller.update)
    .delete(middleware.employeeOrAdminAuth, controller.delete)

module.exports = router;