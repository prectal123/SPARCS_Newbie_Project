const mongoose = require("mongoose");

const OSchemaDefinition = {
    title: String,
    Key: {
        type: String,
        default: "",
    },
    PW: {
        type: String,
        default: "",
    },
    Money: {
        type: Number,
        default: 10000,
    }
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const AccountModel = mongoose.model("account", schema);

module.exports = AccountModel;

