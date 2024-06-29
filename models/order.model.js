const { default: mongoose } = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        cartId: mongoose.Schema.Types.ObjectId,
        clientInfor: {
            fullName: String,
            phone: String,
            address: String
        },
        products: [
            {
                productId: mongoose.Schema.Types.ObjectId,
                price: Number,
                discountPercentage: Number,
                quantity: Number
            }
        ]
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema, "orders");

module.exports = Order;