const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart
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

        const product = await Product.findOne({
            _id: productId,
            deleted: false,
            status: "active"
        });

        if (!product) {
            req.flash('fail', "Product invalid !");
            return res.redirect('back');
        }

        if (!cart) {
            return res.send("Not found card");
        }

        const productExists = cart.products.some(product => product.productId.toString() === productId);

        if (!productExists) {
            if (quantity > product.stock) {
                req.flash("fail", "Not enough products in stock !");
                return res.redirect("back");
            }

            cart.products.push({ productId: productId, quantity: quantity, checked: true });
        } else {
            let check = true;

            cart.products = cart.products.map(item => {
                if (item.productId.toString() === productId) {
                    if (item.quantity + quantity > product.stock) {
                        check = false;
                    }
                    item.quantity += quantity;
                }
                return item;
            });

            if (!check) {
                req.flash("fail", "Not enough products in stock !");
                return res.redirect("back");
            }
        }

        await cart.save();

        req.flash('success', 'Added !');
        res.redirect("back");
    } catch (e) {
        res.redirect("back");
    }
}

// [PATCH] /cart/changeProduct/checked/:productId
module.exports.patchChecked = async (req, res) => {
    try {
        const productId = req.params.productId;
        const checked = req.body.checkitem ? true : false;

        const result = await Cart.updateOne(
            { _id: res.locals.cart.id, 'products.productId': productId },
            { $set: { 'products.$.checked': checked } }
        )

        res.redirect("back");
    } catch (e) {
        res.redirect("back");
    }
}

// [PATCH] /changeProduct/quantity/:productId
module.exports.patchQuantity = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.body.quantity);

        const product = await Product.findOne({
            _id: productId,
            deleted: false,
            status: "active"
        });

        if (!product) {
            req.flash("fail", "Action fail!");
            return res.redirect("back");
        }

        if (quantity > product.stock) {
            req.flash("fail", "Not enough products in stock!");
            return res.redirect("back");
        }

        await Cart.updateOne(
            { _id: res.locals.cart.id, 'products.productId': productId },
            { $set: { 'products.$.quantity': quantity } }
        );

        const cart = await Cart.findById(res.locals.cart.id);

        res.redirect("back");
    } catch (e) {
        res.redirect("back");
    }
}

// [DELETE] /cart/deleteProduct/:productId
module.exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;

        await Cart.updateOne(
            { _id: res.locals.cart.id },
            { $pull: { products: { productId: productId } } }
        );

        res.redirect("back");
    } catch (e) {
        res.redirect("back");
    }
}

// [POST] /buyNow/:productId/:quantity
module.exports.buyNow = async (req, res) => {
    try {
        const productId = req.params.productId;
        const quantity = parseInt(req.params.quantity);
        const cartId = req.cookies.cartId;
        const cart = await Cart.findById(cartId);

        const product = await Product.findOne({
            _id: productId,
            deleted: false,
            status: "active"
        });

        if (!product) {
            req.flash('fail', "Product invalid !");
            return res.redirect('back');
        }

        if (quantity > product.stock) {
            req.flash("fail", "Not enough products in stock !");
            return res.redirect("back");
        }

        if (!cart) {
            return res.send("Not found card");
        }

        const productExists = cart.products.some(product => product.productId.toString() === productId);

        if (!productExists) {
            cart.products.push({ productId: productId, quantity: quantity, checked: true });
        } else {
            cart.products = cart.products.map(item => {
                if (item.productId.toString() === productId) {
                    item.quantity = quantity;
                }
                return item;
            });
        }
        for (let i = 0; i < cart.products.length; i++) {
            const product = cart.products[i];
            if (product.productId.toString() === productId) {
                product.checked = true;

                const [selectedProduct] = cart.products.splice(i, 1);
                cart.products.unshift(selectedProduct);
            } else {
                product.checked = false;
            }
        }

        await cart.save();

        req.flash('success', 'Added !');
        res.redirect('/cart');
    } catch (e) {
        res.redirect("back");
    }
}