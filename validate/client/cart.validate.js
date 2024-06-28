module.exports.addProduct = async (req, res, next) => {
    const quantity = req.body.quantity;

    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
        req.flash('fail', 'Please enter a valid quantity');
        return res.redirect("back");
    }

    next();
}