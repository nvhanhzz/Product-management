const express = require("express");
const router = express.Router();
const validate = require("../../validate/admin/account.validate");
const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/account.controller");

router.get("/create-account", controller.getCreate);

router.post("/create-account", upload.single('avatar'), validate.validateCreateAccountForm, controller.postCreate);

router.patch("/change-status/:status/:id", controller.patchChangStatus);

router.delete("/delete-accounts/:id", controller.deleteAccount);

router.get("/update-account/:id", controller.getUpdateAccount);

router.patch("/update-account/:id", upload.single('avatar'), validate.validateUpdateAccountForm, controller.patchUpdateAccount);

router.get("/edit-history/:id", controller.getEditHistory);

router.get("/:id", controller.getDetail);

router.get("/", controller.index);

module.exports = router;