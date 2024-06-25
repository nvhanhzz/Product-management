module.exports.validateLoginForm = async (req, res, next) => {
    if (!req.body.email) {
        req.flash('fail', 'Please fill in the email field');
        res.redirect("back");
    } else if (!req.body.password) {
        req.flash('fail', 'Please fill in the password field');
        res.redirect("back");
    } else {
        next();
    }
}