const Account = require("../models/account.model");

module.exports.createdBy = async (item) => {
    try {
        const account = await Account.findOne({
            _id: item.createdBy.accountId,
            deleted: false
        });

        if (account && account.fullName) {
            item.creatorName = account.fullName;
        } else {
            item.creatorName = 'Unknown';
        }
    } catch (error) {
        item.creatorName = 'Error';
    }
}

module.exports.updatedBy = async (item) => {
    try {
        const account = await Account.findOne({
            _id: item.accountId,
            deleted: false
        });

        if (account && account.fullName) {
            item.updatorName = account.fullName;
        } else {
            item.updatorName = 'Unknown';
        }
    } catch (error) {
        item.updatorName = 'Error';
    }
}