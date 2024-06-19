const multer = require('multer');
const path = require('path');

module.exports.storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../product-management/public/admin/upload');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});