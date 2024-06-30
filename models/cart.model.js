const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        clientId: mongoose.Schema.Types.ObjectId,
        products: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                quantity: Number,
                checked: Boolean
            }
        ]
    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema, "carts");

module.exports = Cart;