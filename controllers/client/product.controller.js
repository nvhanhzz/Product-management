const Product = require("../../models/product.model");
const paginationHelper = require("../../helper/pagination");
const ProductCategory = require("../../models/product-category.model");
const CategoryTreeHelper = require("../../helper/categoryTree");
const getIdOfSubTreeHelper = require("../../helper/getIdOfSubTree");

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
        const product = await Product.findOne({
            slug: slug,
            deleted: false,
            status: "active"
        })

        const category = await ProductCategory.findOne({
            _id: product.categoryId,
            deleted: false,
        })

        product.category = category;

        product.newPrice = (product.price / 100 * (100 - product.discountPercentage)).toFixed(2);

        res.render(`client/pages/products/productDetail`, {
            pageTitle: product.title,
            product: product
        });
    } catch (e) {
        console.log(e);
        res.redirect("back");
    }
}

// [GET] /products/category/:categorySlug
module.exports.productOfCategory = async (req, res) => {
    try {
        const slug = req.params.categorySlug;
        const category = await ProductCategory.findOne({
            deleted: false,
            slug: slug
        });

        const listCategory = await ProductCategory.find({
            deleted: false,
            status: "active"
        })

        const tree = CategoryTreeHelper.tree(listCategory, [category.id]);
        const listCategoryId = getIdOfSubTreeHelper.getIds(tree[0]);

        const query = req.query;
        const limit = 6;
        const find = {
            deleted: "false",
            status: "active",
            categoryId: { $in: listCategoryId }
        }

        const total = await Product.countDocuments(find);
        const pagination = paginationHelper.pagination(query, limit, total);

        const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit).sort({ position: "desc" });

        const newProducts = products.map(item => {
            item.priceNew = (item.price / 100 * (100 - item.discountPercentage)).toFixed(2);
            return item;
        });

        res.render("client/pages/products/productOfCategory", {
            pageTitle: category.title,
            products: newProducts,
            pagination: pagination
        });
    } catch (e) {
        res.redirect("back");
    }
}