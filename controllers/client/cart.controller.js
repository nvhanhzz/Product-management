const Cart = require("../../models/cart.model");

// [POST] /cart/addproduct/:productId
module.exports.addProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        const cartId = req.cookies.cartId;
        const cart = await Cart.findById(cartId);

        if (!cart) {
            return res.send("Not found card");
        }

        const productExists = cart.products.some(product => product.productId.toString() === productId);

        if (!productExists) {
            cart.products.push({ productId: productId, quantity: quantity });
        } else {
            cart.products = cart.products.map(product => {
                if (product.productId.toString() === productId) {
                    product.quantity += quantity;
                }
                return product;
            });
        }

        await cart.save();

        req.flash('success', 'Added !');
        res.redirect("back");
    } catch (e) {
        res.redirect("back");
    }
}