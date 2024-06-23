const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/role.controller");

const validate = require("../../validate/createRole.validate");

route.get("/create-role", controller.getCreateRole);

route.post("/create-role", validate.validateCreateRoleForm, controller.createRole);

route.get("/:id", controller.roleDetail);

route.delete("/delete-role/:id", controller.deleteRole);

route.get("/update-role/:id", controller.getUpdateRoleForm);

route.patch("/update-role/:id", controller.updateRole);

route.get("/", controller.index);

module.exports = route;