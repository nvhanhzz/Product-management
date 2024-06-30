const Client = require("../../models/client.model");
const Cart = require("../../models/cart.model");
const hashPassword = require("../../helper/hashPassword");
const jwt = require('jsonwebtoken');

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
    const clientToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

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