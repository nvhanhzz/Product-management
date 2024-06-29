module.exports.order = async (req, res, next) => {
    const fullName = req.body.fullName;
    const phoneNumber = req.body.phone;
    const address = req.body.address;

    if (!fullName) {
        req.flash('fail', 'Please enter your full name');
        return res.redirect("back");
    }

    if (!phoneNumber) {
        req.flash('fail', 'Please enter your phone number');
        return res.redirect("back");
    }

    if (!address) {
        req.flash('fail', 'Please enter your order');
        return res.redirect("back");
    }

    next();
}