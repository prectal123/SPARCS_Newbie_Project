const mongoose = require("mongoose");

const OSchemaDefinition = {
    Author: {
        type: String,
        default: ""
    },
    Address: {
        type: String,
        default: ""
    },
    OriginalName: {
        type: String,
        default: ""
    },

};
const OSchemaOptions = { timestamps: true };

const schema = new mongoose.Schema(OSchemaDefinition, OSchemaOptions);

const ArtModel = mongoose.model("art", schema);

module.exports = ArtModel;
