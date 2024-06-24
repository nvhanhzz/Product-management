const express = require("express");
const route = express.Router();

const controller = require("../../controllers/admin/role.controller");

const validate = require("../../validate/admin/role.validate");

route.get("/create-role", controller.getCreateRole);

route.post("/create-role", validate.validateCreateRoleForm, controller.createRole);

route.delete("/delete-role/:id", controller.deleteRole);

route.get("/update-role/:id", controller.getUpdateRoleForm);

route.patch("/update-role/:id", controller.updateRole);

route.get("/permissions", controller.getPermission);

route.patch("/update-permission", controller.updatePermission);

route.get("/:id", controller.roleDetail);

route.get("/", controller.index);

module.exports = route;