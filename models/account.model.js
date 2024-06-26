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
        "createdBy": {
            "accountId": String,
            "createdAt": {
                type: Date,
                default: Date.now
            }
        },
        "deletedBy": {
            "accountId": String,
            "deletedAt": Date
        },
        "updatedBy": [
            {
                "accountId": String,
                "updatedAt": {
                    type: Date
                }
            }
        ]
    }
);

const Account = mongoose.model("Account", accountSchema, "accounts");

module.exports = Account;