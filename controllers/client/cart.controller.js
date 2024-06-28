const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;

    for (const product of cart.products) {
        const productInfor = await Product.findOne({
            _id: product.productId,
            deleted: false,
            status: 'active'
        });

        if (productInfor) {
            product.render = true;
            productInfor.newPrice = (productInfor.price * (100 - productInfor.discountPercentage) / 100).toFixed(2);
            productInfor.totalPrice = (productInfor.newPrice * product.quantity).toFixed(2);
            product.productInfor = productInfor;
        } else {
            product.render = false;
        }
    }

    res.render("client/pages/cart/index", {
        pageTitle: "Cart",
        cart: cart
    });
}

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