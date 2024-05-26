const database = require("./database");
require("dotenv").config();
const Product = require("../models/product.model");

database.connect();

var products;

async function update() {
    try {
        products = await Product.find({});
        for (let i = 0; i < products.length; ++i) {
            await Product.updateOne({ _id: products[i]._id }, { position: products.length - i });
        }
        console.log("success");
    } catch (error) {
        console.error(error);
    }
}

// Gọi hàm để lấy danh sách sản phẩm
update();