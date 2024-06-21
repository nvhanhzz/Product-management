const express = require("express");
const route = express.Router();
const multer = require('multer');
const upload = require('../../config/UploadPhoto');
const validate = require('../../validate/createProductCategory.validate')

const controller = require("../../controllers/admin/product-category.controller");

route.get("/", controller.index);

route.get("/create-product-category", controller.viewFormCreateProductCategory);

route.post("/create-product-category", upload.single('thumbnail'), validate.validateProductCategoryForm, controller.createProductCategory);

route.patch("/change-status/:status/:id", controller.changeStatus);

route.delete("/delete-product-category/:id", controller.deleteProductCategory);

route.patch("/change-list-product-category/:changeCase", controller.updateListProductCategory);

module.exports = route;