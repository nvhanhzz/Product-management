const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");

router.post('/addProduct/:productId', controller.addProduct);

module.exports = router;