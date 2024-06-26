const express = require("express");
const route = express.Router();
const validate = require("../../validate/admin/account.validate");
const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/account.controller");

route.get("/create-account", controller.getCreate);

route.post("/create-account", upload.single('avatar'), validate.validateCreateAccountForm, controller.postCreate);

route.patch("/change-status/:status/:id", controller.patchChangStatus);

route.delete("/delete-accounts/:id", controller.deleteAccount);

route.get("/update-account/:id", controller.getUpdateAccount);

route.patch("/update-account/:id", upload.single('avatar'), validate.validateUpdateAccountForm, controller.patchUpdateAccount);

route.get("/edit-history/:id", controller.getEditHistory);

route.get("/:id", controller.getDetail);

route.get("/", controller.index);

module.exports = route;