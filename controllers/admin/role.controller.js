const Role = require("../../models/role.model");
const logSupportHelper = require("../../helper/logSupport");
const PATH_ADMIN = require("../../config/system").prefixAdmin;

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-role')) {
        const roles = await Role.find({ deleted: false });
        for (const role of roles) {
            await logSupportHelper.createdBy(role);
        }

        res.render("admin/pages/role/index", {
            pageTitle: "Role",
            roles: roles
        });
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/roles/create-role
module.exports.getCreateRole = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-role')) {
        res.render("admin/pages/role/createRole", {
            pageTitle: "Role"
        });
    } else {
        res.send("No permission");
    }
}

// [POST] /admin/roles/create-role
module.exports.createRole = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-role')) {
        try {
            req.body.createdBy = {
                accountId: res.locals.currentUser.id
            };
            const role = new Role(req.body);
            await role.save();
            req.flash("success", `Create role ${req.body.title} success`);
            res.redirect("/admin/roles");
        } catch (e) {
            console.log(e);
            req.flash("fail", "Error in server");
        }
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/roles/:id
module.exports.roleDetail = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-role')) {
        try {
            const id = req.params.id;
            const role = await Role.findOne({
                _id: id,
                deleted: false
            });
            if (role) {
                await logSupportHelper.createdBy(role);
                res.render("admin/pages/role/roleDetail", {
                    pageTitle: "Role",
                    role: role
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }
        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}

// [DELETE] /admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('delete-role')) {
        const id = req.params.id;

        await Role.updateOne(
            {
                _id: id
            },
            {
                deletedBy: {
                    "accountId": res.locals.currentUser.id,
                    "deletedAt": Date.now()
                },
                deleted: true
            }
        );

        req.flash('success', 'Deleted role success');
        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/roles/update-role/:id
module.exports.getUpdateRoleForm = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-role')) {
        try {
            const id = req.params.id;
            const role = await Role.findOne({
                _id: id,
                deleted: false
            });
            if (role) {
                res.render(`admin/pages/role/updateRole`, {
                    pageTitle: "Update role",
                    role: role
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }
        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/roles/update-role/:id
module.exports.updateRole = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-role')) {
        try {
            const id = req.params.id;
            const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

            // Update the role and add updatedBy information
            const update = await Role.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    $push: {
                        updatedBy: {
                            accountId: accountId,
                            updatedAt: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (update) {
                req.flash('success', `Update role ${req.body.title} successfully!`);
            } else {
                req.flash('fail', `Update failed!`);
            }

            res.redirect("back");
        } catch (error) {
            console.error(error);
            req.flash('fail', `Update failed!`);
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
};

// [GET] /admin/roles/permissions
module.exports.getPermission = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('permission')) {
        const roles = await Role.find({ deleted: false });
        res.render("admin/pages/permission/index", {
            roles: roles,
            pageTitle: "Permission"
        });
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/roles/update-permission
module.exports.updatePermission = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    const accountId = res.locals.currentUser._id; // Giả sử accountId được lưu ở đây

    if (permission.includes('permission')) {
        try {
            const permissions = JSON.parse(req.body.permissions);
            for (const item of permissions) {
                await Role.updateOne({
                    _id: item.id,
                    deleted: false
                }, {
                    $set: {
                        permission: item.listPermission
                    },
                    $push: {
                        updatedBy: {
                            accountId: accountId,
                            updatedAt: new Date()
                        }
                    }
                });
            }
            req.flash("success", "Update permission success");
            res.redirect("back");
        } catch (error) {
            req.flash("fail", "Error in server");
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/roles/edit-history/:id
module.exports.getEditHistory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-role')) {
        try {
            const id = req.params.id;
            const role = await Role.findOne({
                _id: id,
                deleted: false
            });

            if (role) {
                for (const item of role.updatedBy) {
                    await logSupportHelper.updatedBy(item);
                }

                res.render('admin/pages/editHistory/index', {
                    pageTitle: role.title,
                    item: role,
                    permissionView: "role"
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }

        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}