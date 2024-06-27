module.exports.validateProductForm = (req, res, next) => {
    if (!('price' in req.body) || isNaN(req.body.price) || req.body.price === '' || req.body.price < 0) {
        req.body.price = 0;
    }
    if (!('discountPercentage' in req.body) || isNaN(req.body.discountPercentage) || req.body.discountPercentage === '' || req.body.discountPercentage < 0 || req.body.discountPercentage > 100) {
        req.body.discountPercentage = 0;
    }
    if (!('stock' in req.body) || isNaN(req.body.stock) || req.body.stock === '' || req.body.stock < 0) {
        req.body.stock = 0;
    }
    if (!('position' in req.body) || isNaN(req.body.position) || req.body.position === '') {
        req.body.position = 0;
    }
    if (!('status' in req.body) || (req.body.status !== 'active' && req.body.status !== 'inactive')) {
        req.body.status = 'inactive';
    }
    if (!('featured' in req.body) || (req.body.featured !== 'true' && req.body.status !== 'false')) {
        req.body.featured = false;
    } else {
        req.body.featured = Boolean(req.body.featured);
    }
    if (!('title' in req.body) || req.body.title === '') {
        req.flash('fail', 'Please fill in the title field');
        res.redirect("back");
    } else {
        next();
    }
}
