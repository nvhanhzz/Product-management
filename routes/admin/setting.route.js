const express = require("express");
const router = express.Router();

const upload = require('../../config/UploadPhoto');

const controller = require("../../controllers/admin/setting.controller");

router.get("/general-setting", controller.getGeneralSetting);

router.patch("/general-setting", upload.single('logo'), controller.patchGeneralSetting);

module.exports = router;