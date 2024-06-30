const { default: mongoose } = require("mongoose");

const clientSchema = new mongoose.Schema(
    {
        "fullName": String,
        "email": String,
        "password": String,
        "avatar": String,
        "phone": String,
        "status": String,
        "deleted": {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Client = mongoose.model("Client", clientSchema, "clients");

module.exports = Client;