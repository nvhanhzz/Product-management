const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/cart.controller");
const validate = require("../../validate/client/cart.validate");

router.post('/addProduct/:productId', validate.addProduct, controller.addProduct);

router.patch('/changeProduct/checked/:productId', controller.patchChecked);

router.patch('/changeProduct/quantity/:productId', validate.addProduct, controller.patchQuantity);

router.delete('/deleteProduct/:productId', controller.deleteProduct);

router.post('/buyNow/:productId/:quantity', controller.buyNow);

router.get('/', controller.index);

module.exports = router;