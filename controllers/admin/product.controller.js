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
    let thumbnail;
    if (req.file && req.file.filename) {
        thumbnail = "upload/" + req.file.filename; // sau phai sua
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

// [GET] //admin/products/update-product/:id
module.exports.viewFormUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        res.render(`admin/pages/product/updateProduct`, {
            pageTitle: "Update product",
            product: product
        });
    } catch (e) {
        res.redirect("back");
    }
}

// [PATCH] /admin/products/update-product/:id
module.exports.updateProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        if (req.file && req.file.filename) {
            req.body.thumbnail = "upload/" + req.file.filename; // sau phai sua
        }
        const update = await Product.findByIdAndUpdate(productId, req.body, { new: true });

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
}

// [GET] /admin/products/:id
module.exports.productDetail = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.find({
            _id: productId,
            deleted: false
        });
        res.render('admin/pages/product/productDetail', {
            pageTitle: product[0].title,
            product: product[0]
        });
    } catch (e) {
        res.redirect("back");
    }
}