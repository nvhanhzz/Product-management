const ProductCategory = require("../../models/product-category.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const sortHelper = require("../../helper/sort");
const paginationHelper = require("../../helper/pagination");
const treeHelper = require("../../helper/categoryTree");
const paginationTreeHelper = require("../../helper/paginationTree");
const rootCategoryHelper = require("../../helper/getRootCategoryIds");
const logSupportHelper = require("../../helper/logSupport");
const PATH_ADMIN = require("../../config/system").prefixAdmin;

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-product-category')) {
        // console.log(prefixAdmin);
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

        const listCategory = await ProductCategory.find({
            deleted: false
        });
        for (const category of listCategory) {
            await logSupportHelper.createdBy(category);
        }

        const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();

        const categoryTree = treeHelper.tree(listCategory, rootCategoryIds).sort((a, b) => {
            const titleA = a.slug.toLowerCase();
            const titleB = b.slug.toLowerCase();
            if (titleA < titleB) {
                return -1;
            }
            if (titleA > titleB) {
                return 1;
            }
            return 0;
        });

        //pagination tree
        const paginationTree = paginationTreeHelper.paginationTree(query, categoryTree.length);
        //pagination tree
        const resultTree = categoryTree.slice(paginationTree.page - 1, paginationTree.page);

        res.render(`admin/pages/product-category/index`, {
            pageTitle: "Product categories",
            // productCategories: productCategories,
            productCategories: resultTree,
            filterStatus: filterStatus,
            keyword: keyword,
            pagination: paginationTree,
            sortString: sortString
        });
    } else {
        res.send("No permission");
    }
}

// [GET] /admin/product-categories/create-product-category
module.exports.viewFormCreateProductCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-product-category')) {
        const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
        const listCategory = await ProductCategory.find();
        const tree = treeHelper.tree(listCategory, rootCategoryIds);
        // console.log("tree, ", tree);

        const positionDefault = await ProductCategory.countDocuments({}) + 1;
        res.render(`admin/pages/product-category/createProductCategory`, {
            pageTitle: "Create product category",
            positionDefault: positionDefault,
            categoryTree: tree
        });
    } else {
        res.send("No permission");
    }
}

// [POST] /admin/product-categories/create-product-category
module.exports.createProductCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('create-product-category')) {
        const title = req.body.title;
        const description = req.body.description;
        const parentId = req.body.parentId;
        const status = req.body.status;
        const position = req.body.position;
        let thumbnail;
        if (req.file && req.file.path) {
            thumbnail = req.file.path;
        } else {
            thumbnail = 'https://media.istockphoto.com/vectors/no-image-available-icon-vector-id1216251206?k=6&m=1216251206&s=612x612&w=0&h=G8kmMKxZlh7WyeYtlIHJDxP5XRGm9ZXyLprtVJKxd-o=';
        }

        const productCategory = new ProductCategory({
            title: title,
            description: description,
            parentId: parentId,
            thumbnail: thumbnail,
            status: status,
            position: position,
            createdBy: {
                accountId: res.locals.currentUser.id
            }
        });

        try {
            await productCategory.save();
            req.flash('success', 'Create product category success');
        } catch (error) {
            console.error(error);
        }

        res.redirect("/admin/product-categories");
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/product-categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product-category')) {
        try {
            const status = req.params.status;
            const id = req.params.id;
            const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

            // Update the product category and add updatedBy information
            const result = await ProductCategory.findByIdAndUpdate(
                id,
                {
                    status: status,
                    $push: {
                        updatedBy: {
                            accountId: accountId,
                            updatedAt: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (result) {
                req.flash('success', "Change status success");
            } else {
                req.flash('error', 'Product category not found');
            }

            res.redirect("back");
        } catch (error) {
            console.error(error);
            req.flash('error', 'An error occurred while changing status');
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
}

// [DELETE] /admin/product-categories/delete-product-category/:id
module.exports.deleteProductCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('delete-product-category')) {
        try {
            const id = req.params.id;

            const result = await ProductCategory.findByIdAndUpdate(id, {
                deleted: true,
                deletedBy: {
                    "accountId": res.locals.currentUser.id,
                    "deletedAt": Date.now()
                }
            });

            if (result) {
                req.flash('success', "Delete category success");
                res.redirect("back");
            }
        } catch (e) {
            console.log(e);
        }
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/product-categories/change-list-product-category/:changeCase
module.exports.updateListProductCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product-category')) {
        const changeCase = req.params.changeCase;
        const listProductCategoryChange = req.body.inputChangeListProduct.split(", ");
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
                for (let i = 0; i < listProductCategoryChange.length; ++i) {
                    try {
                        const result = await ProductCategory.updateOne(
                            { _id: listProductCategoryChange[i] },
                            {
                                position: parseInt(listPosition[i]),
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
                        console.error(`Error updating product category ${listProductCategoryChange[i]}:`, error);
                    }
                }
                if (check) {
                    req.flash('success', `Change position of ${listProductCategoryChange.length} item(s) success`);
                }
                res.redirect("back");
                return;

            default:
                break;
        }

        if (changeCase !== "change_position") {
            try {
                await ProductCategory.updateMany(
                    {
                        _id: { $in: listProductCategoryChange },
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
                        req.flash('success', `Changed ${listProductCategoryChange.length} item(s) to active successfully`);
                        break;

                    case 'inactive':
                        req.flash('success', `Changed ${listProductCategoryChange.length} item(s) to inactive successfully`);
                        break;

                    case 'delete':
                        req.flash('success', `Deleted ${listProductCategoryChange.length} item(s) successfully`);
                        break;
                }

            } catch (error) {
                console.error(error);
                req.flash('error', 'An error occurred while updating product categories');
            }
        }

        res.redirect("back");
    } else {
        res.send("No permission");
    }
};

// [GET] /admin/product-categories/:id
module.exports.viewDetail = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('view-product-category')) {
        try {
            const id = req.params.id;
            const category = await ProductCategory.findOne({
                _id: id,
                deleted: false
            });

            if (category) {
                await logSupportHelper.createdBy(category);

                if (category && category.parentId !== '') {
                    const parent = await ProductCategory.findOne({
                        _id: category.parentId,
                        deleted: false
                    });
                    if (parent) {
                        category.par = parent.title;
                    } else {
                        category.par = null; // or any default value
                    }
                }

                res.render('admin/pages/product-category/productCategoryDetail', {
                    pageTitle: category.title,
                    category: category
                });
            } else {
                res.redirect(`${PATH_ADMIN}/dashboard`);
            }
        } catch (error) {
            res.redirect(`${PATH_ADMIN}/dashboard`);
        }
    } else {
        res.send("No permission");
    }
};

// [GET] /admin/product-categories/update-product-category/:id
module.exports.viewFormUpdateCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product-category')) {
        try {
            const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
            const listCategory = await ProductCategory.find();
            const tree = treeHelper.tree(listCategory, rootCategoryIds);
            const id = req.params.id;
            const category = await ProductCategory.findOne({
                _id: id,
                deleted: false
            });

            if (category) {
                res.render(`admin/pages/product-category/updateProductCategory`, {
                    pageTitle: "Update product category",
                    category: category,
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

// [PATCH] /admin/product-categories/update-product-category/:id
module.exports.updateCategory = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-product-category')) {
        try {
            const id = req.params.id;
            const accountId = res.locals.currentUser._id; // Assuming the current user's ID is stored in res.locals.currentUser._id

            if (req.body.parentId === id) {
                req.flash('fail', `Update failed, it cannot be selected as a parent category!`);
                res.redirect("back");
                return;
            }

            if (req.file && req.file.path) {
                req.body.thumbnail = req.file.path;
            }

            // Update the product category and add updatedBy information
            const update = await ProductCategory.findByIdAndUpdate(
                id,
                {
                    ...req.body,
                    $push: {
                        updatedBy: {
                            accountId: accountId,
                            updatedAt: new Date()
                        }
                    }
                },
                { new: true }
            );

            if (update) {
                req.flash('success', `Update product category ${req.body.title} successfully!`);
            } else {
                req.flash('fail', `Update failed!`);
            }

            res.redirect("back");
        } catch (error) {
            console.error(error);
            req.flash('fail', `Update failed!`);
            res.redirect("back");
        }
    } else {
        res.send("No permission");
    }
};