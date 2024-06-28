const homeRoutes = require('./home.route');
const productRoutes = require('./product.route');
const searchRoutes = require('./search.route');

const categoryTree = require('../../middleware/client/categoryTree');

module.exports = (app) => {
    app.use((req, res, next) => {
        categoryTree.categoryTree(req, res, next);
    });
    app.use('/products', productRoutes);

    app.use('/search', searchRoutes);

    app.use('/', homeRoutes);
}