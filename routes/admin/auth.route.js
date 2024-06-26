const express = require("express");
const route = express.Router();
const validate = require("../../validate/admin/auth.validate");

const controller = require("../../controllers/admin/auth.controller");

route.get("/login", controller.getLogin);

route.post("/login", validate.validateLoginForm, controller.postLogin);

route.post("/logout", controller.postLogout);

module.exports = route;