const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");

// [GET] /checkout
module.exports.index = async (req, res) => {
    const cart = res.locals.cart;
    let totalPrice = 0;

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

            if (product.checked) {
                totalPrice += parseFloat(productInfor.totalPrice);
            }
        } else {
            product.render = false;
        }
    }

    cart.totalPrice = totalPrice.toFixed(2);

    res.render("client/pages/checkout/index", {
        pageTitle: "Checkout",
        cart: cart
    });
}

// [POST] /checkout/order
module.exports.postOrder = async (req, res) => {
    const cart = res.locals.cart;
    const products = cart.products.filter(item => item.checked);

    for (const item of products) {
        const product = await Product.findOne({
            _id: item.productId,
            deleted: false,
            status: "active"
        });

        if (!product) {
            req.flash("fail", "Product does not exist !");
            return res.redirect("back");
        }

        if (item.quantity > product.stock) {
            req.flash("fail", "Not enought product !");
            return res.redirect("back");
        }

        item.price = product.price;
        item.discountPercentage = product.discountPercentage;
    }

    for (const item of products) {
        await Product.updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } }
        );
    }

    await Cart.updateOne(
        { _id: cart._id },
        { $pull: { products: { productId: { $in: products.map(item => item.productId) } } } }
    );

    const order = new Order({
        cartId: cart._id,
        clientInfor: req.body,
        products: products
    })

    await order.save();

    res.send("Order success");
}