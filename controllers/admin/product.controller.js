const Product = require("../../models/product.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");

// [GET] /admin/products
module.exports.index = async (req, res) => {
    // filter
    const filterObject = filterHelper.filterStatus(req);
    const status = filterObject.status;
    const filterStatus = filterObject.filterStatus;
    //end filter

    //search
    const search = searchHelper.search(req);
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

    const products = await Product.find(find);
    //end create find object

    res.render("admin/pages/product/index", {
        pageTitle: "Product",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword
    });
}