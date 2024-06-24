module.exports.validateProductCategoryForm = (req, res, next) => {
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