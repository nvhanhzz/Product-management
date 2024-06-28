const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.cartMiddleware = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (!cookies.cartId) {
            const cart = new Cart();
            await cart.save();
            res.cookie("cartId", cart.id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24 * 365
            });
            res.locals.cart = cart;
        } else {
            const cartId = cookies.cartId;
            const cart = await Cart.findById(cartId);
            cart.totalItem = 0;

            for (const item of cart.products) {
                const product = await Product.findOne({
                    _id: item.productId,
                    deleted: false,
                    status: 'active'
                });

                if (product) {
                    cart.totalItem += 1;
                }
            }

            res.locals.cart = cart;
        }

        next();
    } catch (err) {
        console.error("Error in cartMiddleware:", err);
        next(err);
    }
}