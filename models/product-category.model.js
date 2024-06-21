const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema(
    {
        "title": String,
        "description": String,
        "parentId": String,
        "thumbnail": String,
        "status": String,
        "position": Number,
        "deleted": {
            type: Boolean,
            default: false
        },
        "deletedAt": Date,
        slug: { type: String, slug: "title", unique: true }
    },
    { timestamps: true }
);

const ProductCategory = mongoose.model("ProductCategory", productCategorySchema, "product-categories");

module.exports = ProductCategory;