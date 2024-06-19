const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: "dvzmizrck",
    api_key: "326312553839612",
    api_secret: process.env.cloudinary_secret
});

module.exports = cloudinary;