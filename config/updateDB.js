const database = require("./database");
require("dotenv").config();
const Product = require("../models/product.model");
const crypto = require('crypto');

database.connect();

async function updateProductsWithSlugs() {
    try {

        const products = await Product.find({ slug: { $exists: false } });

        for (const product of products) {
            let newSlug = slugify(product.title);
            let slugExists = await Product.findOne({ slug: newSlug });

            while (slugExists) {
                const randomString = crypto.randomBytes(4).toString('hex');
                newSlug = `${newSlug}-${randomString}`;
                slugExists = await Product.findOne({ slug: newSlug });
            }

            product.slug = newSlug;
            await product.save();
        }

        console.log('Slug update complete');
    } catch (error) {
        console.error('Error updating slugs:', error);
    }
}

function slugify(text) {
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')           // Replace spaces with -
        .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
        .replace(/\-\-+/g, '-')         // Replace multiple - with single -
        .replace(/^-+/, '')             // Trim - from start of text
        .replace(/-+$/, '');            // Trim - from end of text
}

updateProductsWithSlugs();