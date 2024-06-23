const ProductCategory = require("../models/product-category.model");

module.exports.rootCategoryIds = async () => {
    const deletedParents = await ProductCategory.find({
        deleted: true
    }).select('_id');

    const deletedParentIds = deletedParents.map(parent => parent._id);

    const rootCategories = await ProductCategory.find({
        deleted: false,
        $or: [
            { parentId: '' },
            { parentId: { $in: deletedParentIds } }
        ]
    }).select('_id');

    const rootCategoryIds = rootCategories.map(category => category._id.toString());

    return rootCategoryIds;
}