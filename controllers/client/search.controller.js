const Product = require("../../models/product.model");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

// [GET] /search
module.exports.index = async (req, res) => {
    const query = req.query;

    //search
    const search = searchHelper.search(query);
    const regex = search.regex;
    const keyword = search.keyword;
    //end search

    const find = {
        deleted: "false",
        status: "active",
        title: regex
    }

    //pagination
    const limit = 6;
    const total = await Product.countDocuments(find);
    const pagination = paginationHelper.pagination(query, limit, total);
    //endpagination

    const product = await Product.find(find).sort({ position: "desc" }).skip(pagination.skip).limit(pagination.limit);

    const newProduct = product.map(item => {
        item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
        return item;
    });

    res.render("client/pages/search/index", {
        pageTitle: search.keyword,
        products: newProduct,
        pagination: pagination,
        keyword: keyword
    });
}