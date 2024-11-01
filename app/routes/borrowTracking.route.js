const express = require('express');
const controller = require('../controllers/borrowTracking.controller.js');
const middleware = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
    .get(controller.getAll)
    .post(middleware.userAuth, controller.create);

router.route('/:id')
    .get(controller.getById)
    .put(controller.update)
    .delete(middleware.employeeOrAdminAuth, controller.delete);

router.route('/user/:userId')
    .get(middleware.userAuth, controller.getAllByUserId);

module.exports = router;