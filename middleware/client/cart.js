const Cart = require("../../models/cart.model");

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
        }

        next(); // Gọi next() sau khi hoàn tất tất cả các thao tác
    } catch (err) {
        console.error("Error in cartMiddleware:", err);
        next(err); // Truyền lỗi tới middleware xử lý lỗi tiếp theo
    }
}
