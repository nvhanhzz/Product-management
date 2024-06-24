const ProductCategory = require("../../models/product-category.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const sortHelper = require("../../helper/sort");
const paginationHelper = require("../../helper/pagination");
const treeHelper = require("../../helper/categoryTree");
const paginationTreeHelper = require("../../helper/paginationTree");
const rootCategoryHelper = require("../../helper/getRootCategoryIds");

// [GET] /admin/product-categories
module.exports.index = async (req, res) => {
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
}

// [GET] /admin/product-categories/create-product-category
module.exports.viewFormCreateProductCategory = async (req, res) => {
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
}

// [POST] /admin/product-categories/create-product-category
module.exports.createProductCategory = async (req, res) => {
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
        position: position
    });

    try {
        await productCategory.save();
        req.flash('success', 'Create product category success');
    } catch (error) {
        console.error(error);
    }

    res.redirect("/admin/product-categories");
}

// [PATCH] /admin/product-categories/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const status = req.params.status;
        const id = req.params.id;

        const result = await ProductCategory.findByIdAndUpdate(id, { status: status });

        if (result) {
            req.flash('success', "Change status success");
            res.redirect("back");
        }
    } catch (e) {
        console.log(e);
    }
}

// [DELETE] /admin/product-categories/delete-product-category/:id
module.exports.deleteProductCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await ProductCategory.findByIdAndUpdate(id, { deleted: true });

        if (result) {
            req.flash('success', "Delete category success");
            res.redirect("back");
        }
    } catch (e) {
        console.log(e);
    }
}

// [PATCH] /admin/product-categories/change-list-product-category/:changeCase
module.exports.updateListProductCategory = async (req, res) => {

    const changeCase = req.params.changeCase;
    const listProductCategoryChange = req.body.inputChangeListProduct.split(", ");

    const updateObject = {}
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
                        { position: parseInt(listPosition[i]) }
                    );
                    // console.log(`Updated product ${listProductCategoryChange[i]} to position ${listPosition[i]}`);
                } catch (error) {
                    check = false;
                    console.error(`Error updating product category ${listProductCategoryChange[i]}:`, error);
                }
                if (check) {
                    req.flash('success', `Change position of ${listProductCategoryChange.length} item success`);
                }
            }

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
                    $set: updateObject
                }
            )
            switch (changeCase) {
                case 'active':
                    req.flash('success', `Change ${listProductCategoryChange.length} items to active success`);
                    break;

                case 'inactive':
                    req.flash('success', `Change ${listProductCategoryChange.length} items to inactive success`);
                    break;

                case 'delete':
                    req.flash('success', `Deleted ${listProductCategoryChange.length} item success`);
                    break;
            }

        } catch (error) {
            console.error(error);
        }
    }

    // console.log(updateObject);

    res.redirect("back");
}

// [GET] /admin/product-categories/:id
module.exports.viewDetail = async (req, res) => {
    try {
        const id = req.params.id;
        const category = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });

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
    } catch (error) {
        console.error('Error fetching category details:', error);
        res.status(500).send('Internal Server Error');
    }
};

// [GET] /admin/product-categories/update-product-category/:id
module.exports.viewFormUpdateCategory = async (req, res) => {
    try {
        const rootCategoryIds = await rootCategoryHelper.rootCategoryIds();
        const listCategory = await ProductCategory.find();
        const tree = treeHelper.tree(listCategory, rootCategoryIds);
        const id = req.params.id;
        const category = await ProductCategory.findOne({
            _id: id,
            deleted: false
        });
        res.render(`admin/pages/product-category/updateProductCategory`, {
            pageTitle: "Update product category",
            category: category,
            categoryTree: tree
        });
    } catch (e) {
        res.redirect("back");
    }
}

// [PATCH] /admin/product-categories/update-product-category/:id
module.exports.updateCategory = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.parentId === id) {
            req.flash('fail', `Update failled, it cannot be selected as a parent category !`);
            res.redirect("back");
            return;
        }

        if (req.file && req.file.path) {
            req.body.thumbnail = req.file.path;
        }
        const update = await ProductCategory.findByIdAndUpdate(id, req.body, { new: true });

        if (update) {
            req.flash('success', `Update product category ${req.body.title} successfully !`);
            res.redirect("back");
        } else {
            req.flash('fail', `Update failled !`);
            res.redirect("back");
        }
    } catch (e) {
        req.flash('fail', `Update failled !`);
        res.redirect("back");
    }
}