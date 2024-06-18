module.exports.validateProductForm = (req, res, next) => {
    if (req.body.title === '') {
        req.flash('fail', 'Please fill in the title field');
        res.redirect("back");
    }
    else {
        next();
    }
}