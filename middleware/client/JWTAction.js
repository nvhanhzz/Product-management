const jwt = require('jsonwebtoken');
const PATH_ADMIN = require("../../config/system").prefixAdmin;
const Client = require("../../models/client.model");

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

module.exports = checkUserJwt;