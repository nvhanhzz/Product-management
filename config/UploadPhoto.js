const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    folder: "photos",
    allowedFormats: ["jpg", "png", "jpeg", "gif", "bmp", "tiff", "svg", "webp"],
    transformation: [{ width: 500, height: 500, crop: "limit" }]
});

const upload = multer({
    storage: storage
})

module.exports = upload;