const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

module.exports.cartMiddleware = async (req, res, next) => {
    try {
        const client = res.locals.currentClient;
        if (client) {
            const cart = await Cart.findOne({
                clientId: client._id
            });
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