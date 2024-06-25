const Account = require("../../models/account.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const hashPassword = require("../../helper/hashPassword");
const jwt = require('jsonwebtoken');

// [GET] /admin/auth/login
module.exports.getLogin = async (req, res) => {
    const cookies = req.cookies;
    if (cookies && cookies.token) {
        return res.redirect(`${PATH_ADMIN}/dashboard`); // Use return to prevent further execution
    }

    res.render("admin/pages/auth/login", {
        pageTitle: "Login"
    });
}

// [POST] /admin/auth/login
module.exports.postLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const account = await Account.findOne({
            email: email,
            deleted: false,
            status: "active"
        });

        if (!account) {
            req.flash("fail", "Login fail !");
            res.redirect("back");
            return;
        }

        const isMatch = await hashPassword.comparePassword(password, account.password);
        if (!isMatch) {
            req.flash("fail", "Login fail !");
            res.redirect("back");
            return;
        }

        const payload = { id: account.id }
        const token = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        });

        req.flash("success", `Login success, hello ${account.fullName}`);
        res.redirect(`${PATH_ADMIN}/dashboard`)

    } catch (error) {
        console.log(error);
        req.flash("fail", "Server error !");
        res.redirect("back");
    }
}

// [POST] /admin/auth/logout
module.exports.postLogout = async (req, res) => {
    res.clearCookie("token");
    res.redirect(`${PATH_ADMIN}/auth/login`);
}