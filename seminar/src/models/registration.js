const mongoose = require("mongoose");

const OSchemaDefinition = {
    title: String,
    ID: {
        type: String,
        default: "",
    },
    PW: {
        type: String,
        default: "",
    },
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const RegisterModel = mongoose.model("register", schema);

module.exports = RegisterModel;

