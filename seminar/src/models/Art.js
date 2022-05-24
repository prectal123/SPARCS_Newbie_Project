const mongoose = require("mongoose");

const OSchemaDefinition = {
    Author: {
        type: String,
        default: "",
    },
    Thumb: {
        type: String,
        default: "",
    },
    Path: {
        type: String,
        default: "",
    },
    FieldName: {
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
    Dated: {
        type: String,
        default: "",
    },
};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const ArtModel = mongoose.model("art", schema);

module.exports = ArtModel;
