const jwt = require('jsonwebtoken');
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const Account = require("../../models/account.model");
const Role = require("../../models/role.model");

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

const checkUserJwt = async (req, res, next) => {
    const cookies = req.cookies;

    if (cookies && cookies.token) {
        const token = cookies.token;
        const decoded = verifyToken(token);
        if (decoded) {
            const user = await Account.findOne({
                _id: decoded.id,
                deleted: false,
                status: "active"
            }).select("-password");

            if (user) {
                const role = await Role.findById(user.roleId);
                user.role = role;
                res.locals.currentUser = user;
                // console.log(res.locals.currentUser);
                return next();
            } else {
                res.clearCookie("token");
                return res.redirect(`${PATH_ADMIN}/auth/login`);
            }
        } else {
            res.clearCookie("token");
            return res.redirect(`${PATH_ADMIN}/auth/login`);
        }
    } else {
        return res.redirect(`${PATH_ADMIN}/auth/login`);
    }
}

module.exports = checkUserJwt;
