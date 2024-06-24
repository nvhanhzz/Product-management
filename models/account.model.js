const { default: mongoose } = require("mongoose");

const accountSchema = new mongoose.Schema(
    {
        "fullName": String,
        "email": String,
        "password": String,
        "avatar": String,
        "phone": String,
        "status": String,
        "roleId": String,
        "deleted": {
            type: Boolean,
            default: false
        },
        "deletedAt": Date
    },
    { timestamps: true }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;