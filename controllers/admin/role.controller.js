const Role = require("../../models/role.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
    const roles = await Role.find({ deleted: false });

    res.render("admin/pages/role/index", {
        pageTitle: "Role",
        roles: roles
    });
}

// [GET] /admin/roles/create-role
module.exports.getCreateRole = async (req, res) => {
    res.render("admin/pages/role/createRole", {
        pageTitle: "Role"
    });
}

// [POST] /admin/roles/create-role
module.exports.createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        req.flash("success", `Create role ${req.body.title} success`);
        res.redirect("/admin/roles");
    } catch (e) {
        console.log(e);
        req.flash("fail", "Error in server");
    }
}

// [GET] /admin/roles/:id
module.exports.roleDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Role.findOne({
            _id: id,
            deleted: false
        });
        res.render("admin/pages/role/roleDetail", {
            pageTitle: "Role",
            role: role
        });
    } catch (e) {
        console.log(e);
        req.redirect("back");
    }
}

// [DELETE] /admin/roles/delete-role/:id
module.exports.deleteRole = async (req, res) => {
    const id = req.params.id;

    await Role.updateOne(
        {
            _id: id
        },
        {
            deletedAt: Date.now(),
            deleted: true
        }
    );

    req.flash('success', 'Deleted role success');
    res.redirect("back");
}

// [GET] /admin/roles/update-role/:id
module.exports.getUpdateRoleForm = async (req, res) => {
    try {
        const id = req.params.id;
        const role = await Role.findOne({
            _id: id,
            deleted: false
        });
        res.render(`admin/pages/role/updateRole`, {
            pageTitle: "Update role",
            role: role
        });
    } catch (e) {
        res.redirect("back");
    }
}

// [PATCH] /admin/roles/update-role/:id
module.exports.updateRole = async (req, res) => {
    try {
        const id = req.params.id;
        const update = await Role.findByIdAndUpdate(id, req.body);

        if (update) {
            req.flash('success', `Update role ${req.body.title} successfully !`);
            res.redirect("back");
        } else {
            req.flash('fail', `Update failled !`);
            res.redirect("back");
        }
    } catch (e) {
        req.flash('fail', `Update failled !`);
        res.redirect("back");
    }
}