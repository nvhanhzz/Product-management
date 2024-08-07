const jwt = require('jsonwebtoken');

const Client = require("../../models/client.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgotPassword.model");
const hashPassword = require("../../helper/hashPassword");
const generateHelper = require("../../helper/generate");
const senMailHelper = require("../../helper/senMail");

// [GET] /client/register
module.exports.getRegister = async (req, res) => {
    const cookies = req.cookies;
    if (cookies && cookies.clientToken) {
        return res.redirect("/");
    }

    res.render('client/pages/client/register', {
        pageTitle: "Register"
    })
}

// [POST] /client/register
module.exports.postRegister = async (req, res) => {
    const existClient = await Client.findOne({
        email: req.body.email
    });

    if (existClient) {
        req.flash('fail', 'Email already exist.');
        return res.redirect("back");
    }

    req.body.password = await hashPassword.hashPassword(req.body.password);
    const client = new Client(req.body);

    await client.save();

    // create cart of client

    const cart = new Cart({
        clientId: client._id,
        products: []
    });
    await cart.save();

    // end create cart of client

    const payload = { id: client.id }
    const clientToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

    res.cookie("clientToken", clientToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

    req.flash("success", `Register success, hello ${client.fullName}.`);
    res.redirect(`/`);
}

// [GET] /client/login
module.exports.getLogin = async (req, res) => {
    const cookies = req.cookies;
    if (cookies && cookies.clientToken) {
        return res.redirect("/");
    }

    res.render('client/pages/client/login', {
        pageTitle: "Login"
    })
}

// [POST] /client/login
module.exports.postLogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const client = await Client.findOne({
        email: email,
        deleted: false,
        status: "active"
    });

    if (!client) {
        req.flash("fail", "Login fail !");
        res.redirect("back");
        return;
    }

    const isMatch = await hashPassword.comparePassword(password, client.password);
    if (!isMatch) {
        req.flash("fail", "Login fail !");
        res.redirect("back");
        return;
    }

    const payload = { id: client.id }
    const clientToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_client_exp });

    res.cookie("clientToken", clientToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

    req.flash("success", `Login success, hello ${client.fullName}.`);
    res.redirect(`/`);
}

// [POST] /client/logout
module.exports.postLogout = async (req, res) => {
    res.clearCookie("clientToken");
    req.flash("success", "You have been successfully logged out.");
    res.redirect(`/`);
}

// [GET] /client/forgot-password
module.exports.getForgotPassword = async (req, res) => {
    const cookies = req.cookies;
    if (cookies && cookies.clientToken) {
        return res.redirect("/");
    }

    res.render("client/pages/client/forgotPassword", {
        pageTitle: "Forgot password"
    })
}

// [POST] /client/forgot-password
module.exports.postForgotPassword = async (req, res) => {
    const email = req.body.email;

    const client = await Client.findOne({
        email: email,
        deleted: false
    });

    if (!client) {
        req.flash('fail', "Account does not exist.");
        return res.redirect("back");
    }
    if (client.status === 'inactive') {
        req.flash('fail', "Account has been locked.");
        return res.redirect("back");
    }

    // Create token verify
    const payload = { id: client.id }
    const verifyToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_verify_exp });

    res.cookie("verifyToken", verifyToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 3
    });
    // End create token verify

    // Create otp
    const otp = generateHelper.generateOTP(8);
    const attemptsLeft = 5;
    const forgotPassword = new ForgotPassword({
        email: email,
        otp: otp,
        attemptsLeft: attemptsLeft
    });

    await forgotPassword.save();
    // End create otp

    // Send otp to client's email
    const subject = `Mã OTP xác minh lấy lại mật khẩu`
    const html = `Mã OTP là <b>${otp}</b>. Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã này.`
    senMailHelper.sendMail(email, subject, html);
    // End send otp to client's email

    res.redirect('/client/verify-otp');
}

// [GET] /client/verify-otp
module.exports.getVerifyOtp = async (req, res) => {
    const email = res.locals.verifyClient.email;

    res.render("client/pages/client/verifyOtp", {
        pageTitle: "Verify OTP",
        email: email
    });
}

// [POST] /client/verify-otp
module.exports.postVerifyOtp = async (req, res) => {
    const email = res.locals.verifyClient.email;
    const otp = req.body.otp;

    const verify = await ForgotPassword.findOne({
        email: email
    });

    if (!verify) {
        req.flash("fail", "OTP expired.");
        return res.redirect("back");
    }

    if (verify.attemptsLeft === 0) {
        req.flash("fail", "You have used up all your attempts.");
        return res.redirect("back");
    }

    if (otp !== verify.otp) {
        verify.attemptsLeft -= 1;
        await verify.save();

        req.flash("fail", `Incorrect OTP, you have ${verify.attemptsLeft} attempts remaining`);
        return res.redirect("back");
    }

    // Create token reset password
    const payload = { id: verify.id }
    const resetPasswordToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_verify_exp });

    res.cookie("resetPasswordToken", resetPasswordToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 3
    });
    // End create token reset password

    return res.redirect("/client/reset-password");
}

// [GET] /client/reset-password
module.exports.getResetPassword = async (req, res) => {
    res.render("client/pages/client/resetPassword", {
        pageTitle: "Reset password"
    });
}

// [PATCH] /client/reset-password
module.exports.patchResetPassword = async (req, res) => {
    const password = req.body.password;
    const email = res.locals.verify.email;

    const client = await Client.findOne({
        email: email
    });

    client.password = await hashPassword.hashPassword(password);
    await client.save();

    await ForgotPassword.findByIdAndDelete(res.locals.verify._id);
    res.clearCookie("verifyToken");
    res.clearCookie("resetPasswordToken");

    const payload = { id: client.id }
    const clientToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_client_exp });

    res.cookie("clientToken", clientToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30
    });

    req.flash("success", `Reset password success, hello ${client.fullName}.`);
    res.redirect(`/`);
}

// [GET] /client/information
module.exports.getInformation = async (req, res) => {
    if (!res.locals.currentClient) {
        return res.redirect("back");
    }

    res.render("client/pages/client/information", {
        pageTitle: res.locals.currentClient.fullName
    });
}

// [GET] /client/update-infor
module.exports.getUpdateInfor = async (req, res) => {
    if (!res.locals.currentClient) {
        return res.redirect("/");
    }

    res.render("client/pages/client/updateInformation", {
        pageTitle: "Update information"
    });
}

// [PATCH] /client/update-infor
module.exports.patchUpdateInfor = async (req, res) => {
    if (!res.locals.currentClient) {
        return res.redirect("back");
    }

    if (req.file && req.file.path) {
        console.log("file", req.file.path)
        req.body.avatar = req.file.path;
    }

    const result = await Client.updateOne(
        { _id: res.locals.currentClient._id },
        req.body
    );

    if (!result) {
        req.flash("fail", "Update fail.");
        return res.redirect("back");
    }

    req.flash("success", "Update information success.");
    res.redirect("back");
}

// [GET] /client/change-password
module.exports.getChangePassword = async (req, res) => {
    if (!res.locals.currentClient) {
        return res.redirect("/");
    }

    res.render("client/pages/client/changePassword", {
        pageTitle: "Change password"
    });
}

// [PATCH] /client/change-password
module.exports.patchChangePassword = async (req, res) => {
    if (!res.locals.currentClient) {
        return res.redirect("/");
    }

    const password = req.body.password;
    const oldPassword = req.body.oldPassword;
    const client = await Client.findById(res.locals.currentClient._id);

    const isMatch = await hashPassword.comparePassword(oldPassword, client.password);
    if (!isMatch) {
        req.flash("fail", "Password incorrect !");
        res.redirect("back");
        return;
    }

    if (password === oldPassword) {
        req.flash("fail", "The new password must be different from the old password.");
        res.redirect("back");
        return;
    }

    client.password = await hashPassword.hashPassword(password);
    await client.save();

    req.flash("success", `Change password success.`);
    res.redirect(`/`);
}