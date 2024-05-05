const Product = require("../../models/product.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const query = req.query;

    // filter
    const filterObject = filterHelper.filterStatus(query);
    const status = filterObject.status;
    const filterStatus = filterObject.filterStatus;
    //end filter

    //search
    const search = searchHelper.search(query);
    const regex = search.regex;
    const keyword = search.keyword;
    //end search

    //create find object
    const find = {
        deleted: false
    }
    if (status) {
        find.status = status;
    }
    if (regex) {
        find.title = regex;
    }
    //end create find object

    //pagination
    const limit = 5;
    const total = await Product.countDocuments(find);
    const pagination = paginationHelper.pagination(query, limit, total);
    //endpagination

    const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit);

    res.render("admin/pages/product/index", {
        pageTitle: "Product",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination
    });
}