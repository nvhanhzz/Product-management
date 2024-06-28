const homeRoutes = require('./home.route');
const productRoutes = require('./product.route');
const searchRoutes = require('./search.route');
const cartRoutes = require('./cart.route');

const categoryTree = require('../../middleware/client/categoryTree');
const { cartMiddleware } = require('../../middleware/client/cart');

module.exports = (app) => {
    app.use(categoryTree.categoryTree);

    app.use('/cart', cartMiddleware);

    app.use('/cart', cartRoutes);
    app.use('/products', productRoutes);
    app.use('/search', searchRoutes);
    app.use('/', homeRoutes);
}