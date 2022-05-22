const mongoose = require("mongoose");

const OSchemaDefinition = {
    Author: {
        type: String,
        default: "",
    },
    Title: {
        type: String,
        default: "",
    },
    Content: {
        type: String,
        default: "",
    },
    Arcive: {
        type: String,
        default: "",
    },

};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const ArtModel = mongoose.model("whattodo", schema);

module.exports = ArtModel;
