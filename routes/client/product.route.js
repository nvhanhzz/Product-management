const express = require('express');
const router = express.Router();

const controller = require("../../controllers/client/product.controller");

router.get('/category/:categorySlug', controller.productOfCategory);

router.get('/:slug', controller.productDetail);

router.get('/', controller.index);

module.exports = router;