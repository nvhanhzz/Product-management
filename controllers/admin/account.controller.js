const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const hashPassword = require("../../helper/hashPassword");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-account')) {
        const accounts = await Account.find({ deleted: false });
        for (let item of accounts) {
            const role = await Role.findOne({
                _id: item.roleId,
                deleted: false
            });

            item.role = role ? role.title : null;
        }

        res.render("admin/pages/account/index", {
            pageTitle: "Accounts",
            accounts: accounts
        });
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/accounts/create-account
module.exports.getCreate = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-account')) {
        const roles = await Role.find({ deleted: false });
        res.render("admin/pages/account/createAccount.pug", {
            pageTitle: "Create account",
            roles: roles
        });
    } else {
        res.send("No permission");
    }
}

// [POST] /admin/accounts/create-account
module.exports.postCreate = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-account')) {
        if (req.file && req.file.path) {
            req.body.avatar = req.file.path;
        } else {
            req.body.avatar = 'https://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=6&m=1216251206&s=612x612&w=0&h=G8kmMKxZlh7WyeYtlIHJDxP5XRGm9ZXyLprtVJKxd-o=';
        }

        req.body.password = await hashPassword.hashPassword(req.body.password);

        const account = new Account(req.body);

        try {
            await account.save();
            req.flash('success', 'Create account success');
        } catch (error) {
            console.error(error);
        }

        res.redirect(`${PATH_ADMIN}/accounts`);
    } else {
        res.send("No permission");
    }

}

// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.patchChangStatus = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-account')) {
        const status = req.params.status;
        const id = req.params.id;

        try {
            await Account.updateOne(
                {
                    _id: id,
                    deleted: false
                },
                {
                    status: status
                }
            );
            req.flash('success', 'Update status success');
        } catch (error) {
            console.log(error);
        }
        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [DELETE] /admin/accounts/delete-accounts/:id
module.exports.deleteAccount = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('delete-account')) {
        const id = req.params.id;
        try {
            await Account.updateOne(
                {
                    _id: id,
                    deleted: false
                },
                {
                    deleted: true
                }
            );
            req.flash('success', 'Delete account success');
        } catch (error) {
            console.log(error);
        }
        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/accounts/:id
module.exports.getDetail = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-account')) {
        try {
            const id = req.params.id;
            const account = await Account.findOne({
                _id: id,
                deleted: false
            }).select("-password");

            const role = await Role.findOne({
                _id: account.roleId,
                deleted: false
            });

            account.role = role ? role.title : null;

            res.render("admin/pages/account/accountDetail", {
                pageTitle: account.fullName,
                account: account
            })
        } catch (e) {
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/accounts/update-account/:id
module.exports.getUpdateAccount = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-account')) {
        try {
            const id = req.params.id;
            const account = await Account.findOne({
                _id: id,
                deleted: false
            }).select("-password");

            const roles = await Role.find({ deleted: false });

            res.render("admin/pages/account/updateAccount", {
                pageTitle: account.fullName,
                account: account,
                roles: roles
            })
        } catch (e) {
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/accounts/update-account/:id
module.exports.patchUpdateAccount = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-account')) {
        try {
            const id = req.params.id;
            if (req.file && req.file.path) {
                req.body.avatar = req.file.path;
            }

            if (req.body.password) {
                req.body.password = await hashPassword.hashPassword(req.body.password);
            }

            const update = await Account.findByIdAndUpdate(id, req.body, { new: true });

            if (update) {
                req.flash('success', `Update account of ${req.body.fullName} successfully !`);
                res.redirect("back");
            } else {
                req.flash('fail', `Update failled !`);
                res.redirect("back");
            }
        } catch (e) {
            req.flash('fail', `Update failled !`);
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}