const ProductCategory = require("../../models/product-category.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const sortHelper = require("../../helper/sort");
const paginationHelper = require("../../helper/pagination");

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

    //pagination
    const limit = 5;
    const total = await ProductCategory.countDocuments(find);
    const pagination = paginationHelper.pagination(query, limit, total);
    //endpagination

    const productCategories = await ProductCategory.find(find).skip(pagination.skip).limit(pagination.limit).sort(sortObject);

    res.render(`admin/pages/product-category/index`, {
        pageTitle: "Product categories",
        productCategories: productCategories,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination,
        sortString: sortString
    });
}

// [GET] /admin/product-categories/create-product-category
module.exports.viewFormCreateProductCategory = async (req, res) => {
    const positionDefault = await ProductCategory.countDocuments({}) + 1;
    res.render(`admin/pages/product-category/createProductCategory`, {
        pageTitle: "Create product category",
        positionDefault: positionDefault
    });
}

// [POST] /admin/product-categories/create-product-category
module.exports.createProductCategory = async (req, res) => {
    // console.log("1", req.body);

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