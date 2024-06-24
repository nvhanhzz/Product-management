const express = require("express");
const route = express.Router();
const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/product.controller");
const validate = require("../../validate/admin/porduct.validate");

route.get("/", controller.index);

route.patch("/change-status/:status/:itemId", controller.changeStatus);

route.patch("/change-list-product/:changeCase", controller.changeListProduct);

route.delete("/delete-product/:id", controller.deleteProduct);

route.get("/create-product", controller.viewFormCreateProduct);

route.post("/create-product", validate.validateProductForm, upload.single('thumbnail'), controller.createProduct);

route.get("/update-product/:id", controller.viewFormUpdateProduct);

route.patch("/update-product/:id", validate.validateProductForm, upload.single('thumbnail'), controller.updateProduct);

route.get("/:id", controller.productDetail);

module.exports = route;