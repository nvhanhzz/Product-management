const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/checkout.controller");
const validate = require("../../validate/client/checkout.validate");

router.get('/success/:orderId', controller.getOrderSuccess);

router.post('/order', validate.order, controller.postOrder);

router.get('/', controller.index);

module.exports = router;