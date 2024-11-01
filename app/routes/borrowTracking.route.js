const express = require('express');
const controller = require('../controllers/borrowTracking.controller.js');
const middleware = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
    .post(middleware.userAuth, controller.create);
    

router.route('/admin')
    .get(middleware.employeeOrAdminAuth, controller.getAll);

router.route('/admin/:id')
    .put(middleware.employeeOrAdminAuth, controller.update);
    

router.route('/:id')
    .get(controller.getById);

router.route('/user/:id')
    .get(middleware.userAuth, controller.getAllByUserId)
    .put(middleware.userAuth, controller.update);

module.exports = router;