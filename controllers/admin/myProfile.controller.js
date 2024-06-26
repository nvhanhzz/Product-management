const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const hashPassword = require("../../helper/hashPassword");
const logSupportHelper = require("../../helper/logSupport");

// [GET] /admin/my-profile
module.exports.index = async (req, res) => {
    try {
        const account = await Account.findOne({
            _id: res.locals.currentUser.id,
            deleted: false
        }).select("-password");

        const role = await Role.findOne({
            _id: account.roleId,
            deleted: false
        });
        account.role = role ? role.title : null;

        if (account) {
            await logSupportHelper.createdBy(account);

            res.render("admin/pages/myProfile/index", {
                pageTitle: "My profile",
                account: account
            })
        } else {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }

    } catch (e) {
        res.redirect(`${PATH_ADMIN}/dashboard`);
    }
}

// [GET] /admin/my-profile/edit
module.exports.getEditProfile = async (req, res) => {
    try {
        const id = res.locals.currentUser.id;
        const account = await Account.findOne({
            _id: id,
            deleted: false
        }).select("-password");

        const roles = await Role.find({ deleted: false });

        if (account) {
            res.render("admin/pages/myProfile/edit", {
                pageTitle: "Edit profile",
                account: account,
                roles: roles
            })
        } else {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } catch (e) {
        res.redirect(`${PATH_ADMIN}/dashboard`);
    }
}

// [PATCH] /admin/my-profile/edit
module.exports.patchEditProfile = async (req, res) => {
    try {
        const id = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

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
                        accountId: id,
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
}