const express = require('express');
const controller = require('../controllers/employee.controller.js');
const middleware = require('../middleware/auth.js')

const router = express.Router();

router.route('/')
    .get(controller.getAll)
    .post(middleware.adminAuth, controller.create)

router.route('/:id')
    .get(controller.getById)
    .put(middleware.adminAuth, controller.update)
    .delete(middleware.adminAuth, controller.delete)

module.exports = router;