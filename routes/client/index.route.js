const homeRoutes = require('./home.route');
const productRoutes = require('./product.route');

const categoryTree = require('../../middleware/client/categoryTree');

module.exports = (app) => {
    app.use((req, res, next) => {
        categoryTree.categoryTree(req, res, next);
    });
    app.use('/', homeRoutes);

    app.use('/products', productRoutes);
}