const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const hashPassword = require("../../helper/hashPassword");
const logSupportHelper = require("../../helper/logSupport");

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
            await logSupportHelper.createdBy(item);
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
        req.body.createdBy = {
            accountId: res.locals.currentUser.id
        };
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
        const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

        try {
            // Update the account status and add updatedBy information
            const result = await Account.updateOne(
                {
                    _id: id,
                    deleted: false
                },
                {
                    status: status,
                    $push: {
                        updatedBy: {
                            accountId: accountId,
                            updatedAt: new Date()
                        }
                    }
                }
            );

            if (result.nModified > 0) {
                req.flash('success', 'Update status success');
            } else {
                req.flash('fail', 'Account not found or status not updated');
            }
        } catch (error) {
            console.error(error);
            req.flash('fail', 'Failed to update status');
        }
        res.redirect("back");
    } else {
        res.send("No permission");
    }
};

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
                    deletedBy: {
                        "accountId": res.locals.currentUser.id,
                        "deletedAt": Date.now()
                    },
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

            if (account) {
                await logSupportHelper.createdBy(account);

                res.render("admin/pages/account/accountDetail", {
                    pageTitle: account.fullName,
                    account: account
                })
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

            if (account) {
                res.render("admin/pages/account/updateAccount", {
                    pageTitle: account.fullName,
                    account: account,
                    roles: roles
                })
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

// [PATCH] /admin/accounts/update-account/:id
module.exports.patchUpdateAccount = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-account')) {
        try {
            const id = req.params.id;
            const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

            if (req.file && req.file.path) {
                req.body.avatar = req.file.path;
            }

            if (req.body.password) {
                req.body.password = await hashPassword.hashPassword(req.body.password);
            }

            // Update the account and add updatedBy information
            const update = await Account.findByIdAndUpdate(
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
                req.flash('success', `Update account of ${req.body.fullName} successfully!`);
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

// [GET] /admin/accounts/edit-history/:id
module.exports.getEditHistory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-account')) {
        try {
            const id = req.params.id;
            const account = await Account.findOne({
                _id: id,
                deleted: false
            });

            if (account) {
                for (const item of account.updatedBy) {
                    await logSupportHelper.updatedBy(item);
                }

                res.render('admin/pages/editHistory/index', {
                    pageTitle: account.title,
                    item: account,
                    permissionView: "account"
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