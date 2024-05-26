const Product = require("../../models/product.model");
const filterHelper = require("../../helper/filterStatus");
const searchHelper = require("../../helper/search");
const paginationHelper = require("../../helper/pagination");
const prefixAdmin = require("../../config/system").prefixAdmin;

// [GET] /admin/products
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

    const products = await Product.find(find).skip(pagination.skip).limit(pagination.limit).sort({ position: "desc" });

    res.render(`admin/pages/product/index`, {
        pageTitle: "Product",
        products: products,
        filterStatus: filterStatus,
        keyword: keyword,
        pagination: pagination
    });
}

// [PATCH] /admin/products/change-status/:status/:_id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const itemId = req.params.itemId;

    try {
        await Product.updateOne(
            {
                _id: itemId
            },
            {
                status: status
            }
        );
        req.flash('success', 'Update status success');
    } catch (error) {
        console.log(error);
    }

    res.redirect("back");
}

// [PATCH] /admin/products/change-list-product/:changeCase
module.exports.changeListProduct = async (req, res) => {
    const changeCase = req.params.changeCase;
    // console.log(changeCase);
    // console.log(req.body);
    const listProductChange = req.body.inputChangeListProduct.split(", ");
    // console.log(listProductChange);
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
            for (let i = 0; i < listProductChange.length; ++i) {
                try {
                    const result = await Product.updateOne(
                        { _id: listProductChange[i] },
                        { position: parseInt(listPosition[i]) }
                    );
                    // console.log(`Updated product ${listProductChange[i]} to position ${listPosition[i]}`);
                } catch (error) {
                    check = false;
                    console.error(`Error updating product ${listProductChange[i]}:`, error);
                }
                if (check) {
                    req.flash('success', `Change position of ${listProductChange.length} item success`);
                }
            }

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
                    $set: updateObject
                }
            )
            switch (changeCase) {
                case 'active':
                    req.flash('success', `Change ${listProductChange.length} items to active success`);
                    break;

                case 'inactive':
                    req.flash('success', `Change ${listProductChange.length} items to inactive success`);
                    break;

                case 'delete':
                    req.flash('success', `Deleted ${listProductChange.length} item success`);
                    break;
            }

        } catch (error) {
            console.error(error);
        }
    }

    // console.log(updateObject);

    res.redirect("back");
}

// [DELETE] /admin/products/delete-product/:id
module.exports.deleteProduct = async (req, res) => {
    const id = req.params.id;

    await Product.updateOne(
        {
            _id: id
        },
        {
            deletedAt: Date.now(),
            deleted: true
        }
    );

    req.flash('success', 'Deleted Item success');
    res.redirect("back");
}

// [GET] /admin/products/create-product
module.exports.viewFormCreateProduct = async (req, res) => {
    const positionDefault = await Product.countDocuments({}) + 1;
    res.render(`admin/pages/product/createProduct`, {
        pageTitle: "Create product",
        positionDefault: positionDefault
    });
}

// [POST] /admin/products/create-product
module.exports.createProduct = async (req, res) => {
    // console.log("1", req.body);

    const title = req.body.title;
    const description = req.body.description;
    const price = parseFloat(req.body.price);
    const discountPercentage = parseFloat(req.body.discountPercentage);
    const stock = parseInt(req.body.stock);
    const thumbnail = req.body.thumbnail;
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
        position: position
    });

    try {
        product.save();
        req.flash('success', 'Create product success');
    } catch (error) {
        console.error(error);
    }

    res.redirect("/admin/products");
}