const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        products: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                quantity: Number,
                checked: Boolean
            }
        ]
    }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;