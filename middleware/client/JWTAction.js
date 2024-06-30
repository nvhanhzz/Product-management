const jwt = require('jsonwebtoken');
const Client = require("../../models/client.model");
const ForgotPassword = require("../../models/forgotPassword.model");

const verifyToken = (token) => {
    const key = process.env.jwt_signature;
    let decoded = null;

    try {
        decoded = jwt.verify(token, key);
    } catch (err) {
        console.log(err);
    }
    return decoded;
}

module.exports.checkUserJwt = async (req, res, next) => {
    // console.log(1);
    const cookies = req.cookies;

    if (cookies && cookies.clientToken) {
        // console.log(2);
        const clientToken = cookies.clientToken;
        const decoded = verifyToken(clientToken);
        // console.log(decoded);
        if (decoded) {
            // console.log(3);
            const client = await Client.findOne({
                _id: decoded.id,
                deleted: false,
                status: "active"
            }).select("-password");

            // console.log(client);
            if (client) {
                res.locals.currentClient = client;
            }
        } else {
            // console.log(6);
            res.clearCookie("clientToken");
        }
    }
    next();
}

module.exports.checkTokenVerifyOtp = async (req, res, next) => {
    // console.log(1);
    const cookies = req.cookies;

    if (cookies && cookies.verifyToken) {
        // console.log(2);
        const token = cookies.verifyToken;
        const decoded = verifyToken(token);
        // console.log(decoded);
        if (decoded) {
            // console.log(3);
            const client = await Client.findOne({
                _id: decoded.id,
                deleted: false,
                status: "active"
            }).select("-password");

            // console.log(client);
            if (client) {
                res.locals.verifyClient = client;
            } else {
                return res.redirect("back");
            }
        } else {
            // console.log(6);
            req.flash("fail", "Fail !")
            res.clearCookie("verifyToken");
            return res.redirect("/client/forgot-password");
        }
    } else {
        // console.log(1);
        req.flash("fail", "Time expried!")
        return res.redirect("/client/forgot-password");
    }
    next();
}

module.exports.checkTokenResetPassword = async (req, res, next) => {
    // console.log(1);
    const cookies = req.cookies;

    if (cookies && cookies.resetPasswordToken) {
        // console.log(2);
        const token = cookies.resetPasswordToken;
        const decoded = verifyToken(token);
        // console.log(decoded);
        if (decoded) {
            // console.log(3);
            const verify = await ForgotPassword.findOne({
                _id: decoded.id
            });

            // console.log(verify);
            if (verify) {
                res.locals.verify = verify;
            } else {
                return res.redirect("back");
            }
        } else {
            // console.log(6);
            req.flash("fail", "Fail !");
            res.clearCookie("resetPasswordToken");
            return res.redirect("/client/forgot-password");
        }
    } else {
        // console.log(1);
        req.flash("fail", "Time expried!")
        return res.redirect("/client/forgot-password");
    }
    next();
}