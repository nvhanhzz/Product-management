const express = require("express");
const router = express.Router();
const validate = require("../../validate/admin/account.validate");
const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/account.controller");

router.get("/create-account", controller.getCreate);

router.post("/create-account", upload.single('avatar'), validate.validateCreateAccountForm, controller.postCreate);

router.get("/", controller.index);

module.exports = router;