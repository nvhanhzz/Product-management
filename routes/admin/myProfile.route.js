const express = require("express");
const route = express.Router();
const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/myProfile.controller");

const validate = require("../../validate/admin/account.validate");

route.get("/edit", controller.getEditProfile);

route.patch("/edit", upload.single('avatar'), validate.validateUpdateAccountForm, controller.patchEditProfile);

route.get("/", controller.index);

module.exports = route;