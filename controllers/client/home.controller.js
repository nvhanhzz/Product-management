const Product = require("../../models/product.model");

// [GET] /
module.exports.index = async (req, res) => {
    const featuredFind = {
        deleted: "false",
        status: "active",
        featured: true
    }

    const featuredProduct = await Product.find(featuredFind).sort({ position: "desc" }).limit(3);

    const newFeaturedProduct = featuredProduct.map(item => {
        item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
        return item;
    });

    const newestProduct = await Product.find({
        deleted: "false",
        status: "active"
    }).sort({ position: "desc" }).limit(3);

    const newNewestProduct = newestProduct.map(item => {
        item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
        return item;
    });

    res.render("client/pages/home/index", {
        pageTitle: "Home",
        featuredProduct: newFeaturedProduct,
        newestProduct: newNewestProduct
    });
}