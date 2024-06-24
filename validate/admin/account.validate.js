const Account = require("../../models/account.model");

module.exports.validateCreateAccountForm = async (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('fail', 'Please fill in the full name field');
        res.redirect("back");
    } else if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field');
        res.redirect("back");
    } else if (!req.body.password) {
        req.flash('fail', 'Please fill in the password field');
        res.redirect("back");
    } else if (!req.body.phone) {
        req.flash('fail', 'Please fill in the phone field');
        res.redirect("back");
    } else if (!req.body.roleId) {
        req.flash('fail', 'Please choose the role');
        res.redirect("back");
    }
    else {
        const account = await Account.findOne({
            email: req.body.email
        });
        if (account) {
            req.flash('fail', 'Email already exist');
            res.redirect("back");
        } else {
            next();
        }
    }
}

module.exports.validateUpdateAccountForm = async (req, res, next) => {
    if (!req.body.password) {
        delete req.body.password;
    }

    if (!req.body.fullName) {
        req.flash('fail', 'Please fill in the full name field');
        res.redirect("back");
    } else if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field');
        res.redirect("back");
    } else if (!req.body.phone) {
        req.flash('fail', 'Please fill in the phone field');
        res.redirect("back");
    } else if (!req.body.roleId) {
        req.flash('fail', 'Please choose the role');
        res.redirect("back");
    }
    else {
        const account = await Account.findOne({
            _id: { $ne: req.params.id },
            email: req.params.email
        });

        if (account) {
            req.flash('fail', 'Email already exist');
            res.redirect("back");
        } else {
            next();
        }
    }
}