const express = require('express');
const controller = require('../controllers/cart.controller.js');
const middleware = require('../middleware/auth.js')

const router = express.Router();

router.route("/:userId")
    .get(middleware.userAuth, controller.getAll)

router.route("/cart/:id")
    .get(middleware.userAuth, controller.getById)

router.route("/add-cart/:userId/:bookId")
    .post(middleware.userAuth, controller.add)

router.route("/:userId/:bookId")
    .post(middleware.userAuth, controller.update)
    .delete(middleware.userAuth, controller.delete)

module.exports = router