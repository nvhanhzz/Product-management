const rootCategoryHelper = require("../../helper/getRootCategoryIds");
const ProductCategory = require("../../models/product-category.model");
const treeHelper = require("../../helper/categoryTree");

module.exports.categoryTree = async (req, res, next) => {
    const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
    const listCategory = await ProductCategory.find();
    const tree = treeHelper.tree(listCategory, rootCategoryIds);

    res.locals.categoryTree = tree;
    next();
}