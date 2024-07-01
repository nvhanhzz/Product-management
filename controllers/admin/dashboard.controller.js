const Account = require("../../models/account.model");
const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const Role = require("../../models/role.model");
const Client = require("../../models/client.model");

// [GET] /admin/dashboard
module.exports.dashboard = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;

    const currentAccount = await Account.findOne({
        _id: res.locals.currentUser.id,
        deleted: false
    }).select("-password");

    const currentRole = await Role.findOne({
        _id: currentAccount.roleId,
        deleted: false
    });
    currentAccount.role = currentRole ? currentRole.title : null;

    const productCategory = {};
    if (permission.includes('view-product-category')) {
        productCategory.quantity = await ProductCategory.countDocuments({});
        productCategory.active = await ProductCategory.countDocuments({ status: "active" });
        productCategory.inactive = productCategory.quantity - productCategory.active;
    }

    const product = {};
    if (permission.includes('view-product')) {
        product.quantity = await Product.countDocuments({});
        product.active = await Product.countDocuments({ status: "active" });
        product.inactive = product.quantity - product.active;
    }

    const adminAccount = {};
    if (permission.includes('view-account')) {
        adminAccount.quantity = await Account.countDocuments({});
        adminAccount.active = await Account.countDocuments({ status: "active" });
        adminAccount.inactive = adminAccount.quantity - adminAccount.active;
    }

    const clientAccount = {};
    if (permission.includes('view-account')) { // sau sẽ phát triển thêm phần quản lý tài khoản người dùng
        clientAccount.quantity = await Client.countDocuments({});
        clientAccount.active = await Client.countDocuments({ status: "active" });
        clientAccount.inactive = clientAccount.quantity - clientAccount.active;
    }

    const role = {};
    if (permission.includes('view-role')) {
        role.quantity = await Role.countDocuments({});
    }

    res.render("admin/pages/dashboard/index", {
        pageTitle: "Dashboard",
        currentAccount: currentAccount,
        productCategory: productCategory,
        product: product,
        adminAccount: adminAccount,
        clientAccount: clientAccount,
        role: role
    });
}