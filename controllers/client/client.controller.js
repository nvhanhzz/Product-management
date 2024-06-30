const Client = require("../../models/client.model");
const hashPassword = require("../../helper/hashPassword");
const jwt = require('jsonwebtoken');

// [GET] /client/register
module.exports.getRegister = async (req, res) => {
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

    const payload = { id: client.id }
    const clientToken = jwt.sign(payload, process.env.jwt_signature, { expiresIn: process.env.token_exp });

    res.cookie("clientToken", clientToken, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60
    });

    req.flash("success", `Register success, hello ${client.fullName}`);
    res.redirect(`/`);
}

// [GET] /client/login
module.exports.getLogin = async (req, res) => {
    res.render('client/pages/client/login', {
        pageTitle: "Login"
    })
}

// [POST] /client/login
module.exports.postLogin = async (req, res) => {
    res.send(req.body);
}