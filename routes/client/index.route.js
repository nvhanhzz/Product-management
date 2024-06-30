const homeRoutes = require('./home.route');
const productRoutes = require('./product.route');
const searchRoutes = require('./search.route');
const cartRoutes = require('./cart.route');
const checkoutRoutes = require('./checkout.route');
const clientRoutes = require('./client.route');

const categoryTree = require('../../middleware/client/categoryTree');
const { cartMiddleware } = require('../../middleware/client/cart');
const JWTAction = require("../../middleware/client/JWTAction");
const ensureAuthenticated = require("../../middleware/client/ensureAuthenticated");

module.exports = (app) => {
    app.use(JWTAction.checkUserJwt);

    app.use(categoryTree.categoryTree);

    app.use(cartMiddleware);

    app.use('/client', clientRoutes);
    app.use('/cart', ensureAuthenticated.ensureAuthenticated, cartRoutes);
    app.use('/products', productRoutes);
    app.use('/search', searchRoutes);
    app.use('/checkout', ensureAuthenticated.ensureAuthenticated, checkoutRoutes);
    app.use('/', homeRoutes);
}