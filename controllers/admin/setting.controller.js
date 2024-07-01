const Setting = require("../../models/general-setting.model");

// [GET] /admin/setting/general-setting
module.exports.getGeneralSetting = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-general-setting')) {
        const setting = await Setting.findOne({});
        res.render("admin/pages/setting/general", {
            pageTitle: "General setting",
            setting: setting ? setting : {}
        });
    } else {
        res.send("No permission");
    }
}

// [PATCH] /admin/setting/general-setting
module.exports.patchGeneralSetting = async (req, res) => {
    const permission = res.locals.currentUser.role.permission;
    if (permission.includes('update-general-setting')) {
        if (req.file && req.file.path) {
            req.body.logo = req.file.path;
        }
        const setting = await Setting.findOne({});
        if (!setting) {
            const newSetting = new Setting(req.body);
            await newSetting.save();
        } else {
            await Setting.updateOne(
                {},
                req.body
            );
        }

        req.flash("success", "Setting success.");
        return res.redirect("back");
    } else {
        res.send("No permission");
    }
}