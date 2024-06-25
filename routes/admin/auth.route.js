const express = require("express");
const router = express.Router();
const validate = require("../../validate/admin/auth.validate");

const controller = require("../../controllers/admin/auth.controller");

router.get("/login", controller.getLogin);

router.post("/login", validate.validateLoginForm, controller.postLogin);

router.post("/logout", controller.postLogout);

module.exports = router;