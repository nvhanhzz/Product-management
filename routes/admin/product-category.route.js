const express = require("express");
const route = express.Router();
const upload = require('../../config/UploadPhoto');
const validate = require('../../validate/admin/productCategory.validate')

const controller = require("../../controllers/admin/product-category.controller");

route.get("/", controller.index);

route.get("/create-product-category", controller.viewFormCreateProductCategory);

route.post("/create-product-category", upload.single('thumbnail'), validate.validateProductCategoryForm, controller.createProductCategory);

route.patch("/change-status/:status/:id", controller.changeStatus);

route.delete("/delete-product-category/:id", controller.deleteProductCategory);

route.patch("/change-list-product-category/:changeCase", controller.updateListProductCategory);

route.get("/update-product-category/:id", controller.viewFormUpdateCategory);

route.patch("/update-product-category/:id", upload.single('thumbnail'), validate.validateProductCategoryForm, controller.updateCategory);

route.get("/edit-history/:id", controller.getEditHistory);

route.get("/:id", controller.viewDetail);

module.exports = route;