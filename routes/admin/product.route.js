const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/product.controller");

route.get("/", controller.index);

route.patch("/change-status/:status/:itemId", controller.changeStatus);

route.patch("/change-list-product/:changeCase", controller.changeListProduct);

route.delete("/delete-product/:id", controller.deleteProduct);

route.get("/create-product", controller.viewFormCreateProduct);

route.post("/create-product", controller.createProduct);

module.exports = route;