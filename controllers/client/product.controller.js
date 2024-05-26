const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
    const products = await Product.find({
        deleted: "false",
        status: "active"
    }).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Product",
        products: newProducts
    });
}