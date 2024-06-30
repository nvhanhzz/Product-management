const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{6,}$/;

module.exports.validatePostRegister = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('fail', 'Please fill in the full name field.');
        return res.redirect("back");
    }
    if (!req.body.phone) {
        req.flash('fail', 'Please fill in the phone field.');
        return res.redirect("back");
    }
    if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field.');
        return res.redirect("back");
    }
    if (!req.body.password) {
        req.flash('fail', 'Please fill in the password field.');
        return res.redirect("back");
    }
    if (!req.body.confirmPassword) {
        req.flash('fail', 'Please fill in the confirm password field.');
        return res.redirect("back");
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('fail', 'Password and confirm password do not match.');
        return res.redirect("back");
    }
    if (!regex.test(req.body.password)) {
        req.flash('fail', 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &, #).');
        return res.redirect("back");
    }

    next();
}

module.exports.validatePostLogin = (req, res, next) => {
    if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field.');
        return res.redirect("back");
    }
    if (!req.body.password) {
        req.flash('fail', 'Please fill in the password field.');
        return res.redirect("back");
    }

    next();
}

module.exports.validatePostForgotPassword = (req, res, next) => {
    if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field.');
        return res.redirect("back");
    }

    next();
}

module.exports.validateVerifyOtp = (req, res, next) => {
    if (!req.body.otp) {
        req.flash('fail', 'Please fill in the otp field.');
        return res.redirect("back");
    }

    next();
}

module.exports.validateResetPassword = (req, res, next) => {
    if (!req.body.password) {
        req.flash('fail', 'Please fill in the password field.');
        return res.redirect("back");
    }
    if (!req.body.confirmPassword) {
        req.flash('fail', 'Please fill in the confirm password field.');
        return res.redirect("back");
    }
    if (req.body.password !== req.body.confirmPassword) {
        req.flash('fail', 'Password and confirm password do not match.');
        return res.redirect("back");
    }
    if (!regex.test(req.body.password)) {
        req.flash('fail', 'Password must be at least 6 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@, $, !, %, *, ?, &, #).');
        return res.redirect("back");
    }

    next();
}

module.exports.validateUpdateInfor = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash('fail', 'Please fill in the full name field.');
        return res.redirect("back");
    }
    if (!req.body.phone) {
        req.flash('fail', 'Please fill in the phone field.');
        return res.redirect("back");
    }
    if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field.');
        return res.redirect("back");
    }

    next();
}