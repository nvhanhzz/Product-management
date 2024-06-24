const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const hashPassword = require("../../helper/hashPassword");

// [GET] /admin/accounts
module.exports.index = async (req, res) => {
    res.render("admin/pages/account/index", {
        pageTitle: "Accounts"
    });
}

// [GET] /admin/accounts/create-account
module.exports.getCreate = async (req, res) => {
    const roles = await Role.find({ deleted: false });
    res.render("admin/pages/account/createAccount.pug", {
        pageTitle: "Create account",
        roles: roles
    });
}

// [GET] /admin/accounts/create-account
module.exports.postCreate = async (req, res) => {
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
}