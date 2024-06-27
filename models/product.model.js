const { default: mongoose } = require("mongoose");
const slug = require('mongoose-slug-updater');

mongoose.plugin(slug);

const productSchema = new mongoose.Schema(
    {
        "title": String,
        "description": String,
        "price": Number,
        "discountPercentage": Number,
        "stock": Number,
        "thumbnail": String,
        "categoryId": String,
        "featured": Boolean,
        "status": String,
        "position": Number,
        "deleted": {
            type: Boolean,
            default: false
        },
        "createdBy": {
            "accountId": String,
            "createdAt": {
                type: Date,
                default: Date.now
            }
        },
        "deletedBy": {
            "accountId": String,
            "deletedAt": Date
        },
        "updatedBy": [
            {
                "accountId": String,
                "updatedAt": {
                    type: Date
                }
            }
        ],
        slug: { type: String, slug: "title", unique: true }
    }
);

const Product = mongoose.model("Product", productSchema, "products");

module.exports = Product;