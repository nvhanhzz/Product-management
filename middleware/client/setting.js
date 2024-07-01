const Setting = require("../../models/general-setting.model");

module.exports.settingMiddleware = async (req, res, next) => {
    const setting = await Setting.findOne({});
    res.locals.generalSetting = setting;
    return next();
}