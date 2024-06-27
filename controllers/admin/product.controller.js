const Product = require("../../models/product.model");
const Account = require("../../models/account.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const sortHelper = require("../../helper/sort");
const paginationHelper = require("../../helper/pagination");
const logSupportHelper = require("../../helper/logSupport");
const rootCategoryHelper = require("../../helper/getRootCategoryIds");
const treeHelper = require("../../helper/categoryTree");
const ProductCategory = require("../../models/product-category.model");
const PATH_ADMIN = require("../../config/system").prefixAdmin;

// [GET] /admin/products
module.exports.index = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-product')) {
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

        //sort
        const sortObject = sortHelper.sort(query);
        const [sortKey, sortValue] = Object.entries(sortObject)[0];
        const sortString = `${sortKey}-${sortValue}`;
        //end sort

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

        const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit).sort(sortObject);

        for (const product of products) {
            await logSupportHelper.createdBy(product);
            const category = await ProductCategory.findOne({
                _id: product.categoryId,
                deleted: false
            });

            if (category) {
                product.category = category.title;
            }
        }

        res.render(`admin/pages/product/index`, {
            pageTitle: "Product",
            products: products,
            filterStatus: filterStatus,
            keyword: keyword,
            pagination: pagination,
            sortString: sortString
        });
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/products/change-status/:status/:_id
module.exports.changeStatus = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product')) {
        const status = req.params.status;
        const itemId = req.params.itemId;

        try {
            await Product.updateOne(
                {
                    _id: itemId,
                    deleted: false
                },
                {
                    $set: {
                        status: status
                    },
                    $push: {
                        updatedBy: {
                            accountId: res.locals.currentUser.id,
                            updatedAt: new Date()
                        }
                    }
                }
            );
            req.flash('success', 'Update status success');
        } catch (error) {
            console.log(error);
        }

        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/products/change-list-product/:changeCase
module.exports.changeListProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product')) {
        const changeCase = req.params.changeCase;
        const listProductChange = req.body.inputChangeListProduct.split(", ");
        const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

        const updateObject = {};
        switch (changeCase) {
            case 'active':
                updateObject.status = 'active';
                break;

            case 'inactive':
                updateObject.status = 'inactive';
                break;

            case 'delete':
                updateObject.deletedAt = Date.now();
                updateObject.deleted = true;
                break;

            case 'change_position':
                const listPosition = req.body.inputProductPosition.split(", ");
                let check = true;
                for (let i = 0; i < listProductChange.length; ++i) {
                    try {
                        const result = await Product.updateOne(
                            { _id: listProductChange[i] },
                            {
                                $set: { position: parseInt(listPosition[i]) },
                                $push: {
                                    updatedBy: {
                                        accountId: accountId,
                                        updatedAt: new Date()
                                    }
                                }
                            }
                        );
                    } catch (error) {
                        check = false;
                        console.error(`Error updating product ${listProductChange[i]}:`, error);
                    }
                }
                if (check) {
                    req.flash('success', `Change position of ${listProductChange.length} item(s) success`);
                }
                res.redirect("back");
                return;

            default:
                break;
        }

        if (changeCase !== "change_position") {
            try {
                await Product.updateMany(
                    {
                        _id: { $in: listProductChange },
                    },
                    {
                        $set: updateObject,
                        $push: {
                            updatedBy: {
                                accountId: accountId,
                                updatedAt: new Date()
                            }
                        }
                    }
                );

                switch (changeCase) {
                    case 'active':
                        req.flash('success', `Changed ${listProductChange.length} item(s) to active successfully`);
                        break;

                    case 'inactive':
                        req.flash('success', `Changed ${listProductChange.length} item(s) to inactive successfully`);
                        break;

                    case 'delete':
                        req.flash('success', `Deleted ${listProductChange.length} item(s) successfully`);
                        break;
                }

            } catch (error) {
                console.error(error);
                req.flash('error', 'An error occurred while updating products');
            }
        }

        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('delete-product')) {
        const id = req.params.id;

        await Product.updateOne(
            {
                _id: id
            },
            {
                deletedBy: {
                    "accountId": res.locals.currentUser.id,
                    "deletedAt": Date.now()
                },
                deleted: true
            }
        );

        req.flash('success', 'Deleted Item success');
        res.redirect("back");
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/products/create-product
module.exports.viewFormCreateProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-product')) {
        const positionDefault = await Product.countDocuments({}) + 1;
        const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
        const listCategory = await ProductCategory.find();
        const tree = treeHelper.tree(listCategory, rootCategoryIds);
        res.render(`admin/pages/product/createProduct`, {
            pageTitle: "Create product",
            positionDefault: positionDefault,
            categoryTree: tree
        });
    } else {
        res.send("No permission");
    }
}

// [POST] /admin/products/create-product
module.exports.createProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-product')) {
        const title = req.body.title;
        const description = req.body.description;
        const price = parseFloat(req.body.price);
        const discountPercentage = parseFloat(req.body.discountPercentage);
        const stock = parseInt(req.body.stock);
        const categoryId = req.body.categoryId;
        const featured = req.body.featured;
        let thumbnail;
        if (req.file && req.file.path) {
            thumbnail = req.file.path;
        } else {
            thumbnail = 'https://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=6&m=1216251206&s=612x612&w=0&h=G8kmMKxZlh7WyeYtlIHJDxP5XRGm9ZXyLprtVJKxd-o=';
        }
        const status = req.body.status;
        const position = req.body.position;

        const product = new Product({
            title: title,
            description: description,
            price: price,
            discountPercentage: discountPercentage,
            stock: stock,
            thumbnail: thumbnail,
            status: status,
            position: position,
            createdBy: {
                accountId: res.locals.currentUser.id
            },
            categoryId: categoryId,
            featured: featured
        });

        try {
            await product.save();
            req.flash('success', 'Create product success');
        } catch (error) {
            console.error(error);
        }

        res.redirect("/admin/products");
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/products/update-product/:id
module.exports.viewFormUpdateProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product')) {
        try {
            const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
            const listCategory = await ProductCategory.find();
            const tree = treeHelper.tree(listCategory, rootCategoryIds);
            const productId = req.params.id;
            const product = await Product.findOne({
                _id: productId,
                deleted: false
            });

            if (product) {
                res.render(`admin/pages/product/updateProduct`, {
                    pageTitle: "Update product",
                    product: product,
                    categoryTree: tree
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }
        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/products/update-product/:id
module.exports.updateProduct = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product')) {
        try {
            const productId = req.params.id;
            if (req.file && req.file.path) {
                req.body.thumbnail = req.file.path;
            }

            const update = await Product.findByIdAndUpdate(
                productId,
                {
                    ...req.body,
                    $push: {
                        updatedBy: {
                            accountId: res.locals.currentUser._id,
                            updatedAt: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (update) {
                req.flash('success', `Update product ${req.body.title} successfully !`);
                res.redirect("back");
            } else {
                req.flash('fail', `Update failled !`);
                res.redirect("back");
            }
        } catch (e) {
            req.flash('fail', `Update failled !`);
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/products/:id
module.exports.productDetail = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-product')) {
        try {
            const productId = req.params.id;
            const product = await Product.findOne({
                _id: productId,
                deleted: false
            });

            if (product) {
                await logSupportHelper.createdBy(product);
                if (product.categoryId) {
                    const category = await ProductCategory.findOne({
                        _id: product.categoryId,
                        deleted: false
                    });
                    if (category) {
                        product.category = category.title
                    }
                }

                res.render('admin/pages/product/productDetail', {
                    pageTitle: product.title,
                    product: product
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }

        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/products/edit-history/:id
module.exports.getEditHistory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-product')) {
        try {
            const productId = req.params.id;
            const product = await Product.findOne({
                _id: productId,
                deleted: false
            });

            if (product) {
                for (const item of product.updatedBy) {
                    await logSupportHelper.updatedBy(item);
                }

                res.render('admin/pages/editHistory/index', {
                    pageTitle: product.title,
                    item: product,
                    permissionView: "product"
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }

        } catch (e) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
}