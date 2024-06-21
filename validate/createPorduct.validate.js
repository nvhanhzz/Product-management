module.exports.validateProductForm = (req, res, next) => {
    if (req.body.price === '') {
        req.body.price = 0;
    }
    if (req.body.discountPercentage === '') {
        req.body.discountPercentage = 0;
    }
    if (req.body.stock === '') {
        req.body.stock = 0;
    }
    if (req.body.position === '') {
        req.body.position = 0;
    }
    if (req.body.title === '') {
        req.flash('fail', 'Please fill in the title field');
        res.redirect("back");
    }
    else {
        next();
    }
}