const Product = require("../../models/product.model");
const paginationHelper = require("../../helper/pagination");

// [GET] /products
module.exports.index = async (req, res) => {
    const query = req.query;
    const limit = 6;
    const find = {
        deleted: "false",
        status: "active"
    }
    const total = await Product.countDocuments(find);
    const pagination = paginationHelper.pagination(query, limit, total);

    const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit).sort({ position: "desc" });

    const newProducts = products.map(item => {
        item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
        return item;
    });

    res.render("client/pages/products/index", {
        pageTitle: "Product",
        products: newProducts,
        pagination: pagination
    });
}

// [GET] /products/:slug
module.exports.productDetail = async (req, res) => {
    try {
        const slug = req.params.slug;
        const product = await Product.find({
            slug: slug,
            deleted: false,
            status: "active"
        })

        product[0].newPrice = (product[0].price / 100 * (100 - product[0].discountPercentage)).toFixed(2);

        res.render(`client/pages/products/productDetail`, {
            pageTitle: product[0].title,
            product: product[0]
        });
    } catch (e) {
        console.log(e);
        res.redirect("back");
    }
}