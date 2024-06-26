const { default: mongoose } = require("mongoose");

const roleSchema = new mongoose.Schema(
    {
        "title": String,
        "description": String,
        "permission": {
            type: Array,
            default: []
        },
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

const Role = mongoose.model("Role", roleSchema, "roles");

module.exports = Role;