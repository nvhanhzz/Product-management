const jwt = require('jsonwebtoken');
const PATH_ADMIN = require("../config/system").prefixAdmin;

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

const checkUserJwt = (req, res, next) => {
    const cookies = req.cookies;
    // console.log(1);

    if (cookies && cookies.token) {
        const token = cookies.token;
        const decoded = verifyToken(token);
        if (decoded) {
            req.decodedJWT = decoded;
            // console.log(decoded);
            next();
        } else {
            res.redirect(`${PATH_ADMIN}/auth/login`);
        }
    } else {
        res.redirect(`${PATH_ADMIN}/auth/login`);
    }
}

module.exports = checkUserJwt;