const systemConfig = require("../../config/system");
const checkUserJwt = require("../../middleware/admin/JWTAction");

const dashboardRoutes = require("./dashboard.route");
const productRoutes = require("./product.route");
const productCategoryRoutes = require("./product-category.route");
const roleRoutes = require("./role.route");
const accountRoutes = require("./account.route");
const authRoutes = require("./auth.route");
const myProfileRoutes = require("./myProfile.route");
const settingRoutes = require("./setting.route");


module.exports = (app) => {
    app.use((req, res, next) => {
        if (req.path.startsWith("/admin")) {
            if (req.path.startsWith("/admin/auth")) {
                return next();
            }
            return checkUserJwt(req, res, next);
        }
        return next();
    });

    const PATH_ADMIN = systemConfig.prefixAdmin;
    app.use(PATH_ADMIN + "/dashboard", dashboardRoutes);
    app.use(PATH_ADMIN + "/products", productRoutes);
    app.use(PATH_ADMIN + "/product-categories", productCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", roleRoutes);
    app.use(PATH_ADMIN + "/accounts", accountRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
    app.use(PATH_ADMIN + "/my-profile", myProfileRoutes);
    app.use(PATH_ADMIN + "/setting", settingRoutes);
}