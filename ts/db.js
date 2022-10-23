"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
mongoose_1["default"].pluralize(null);
var FeedbackSchema = new mongoose_1["default"].Schema({
    answer: String,
    author: String,
    text: String,
    reting: Number,
    date: { type: Date, required: true },
    id: { type: String, required: true }
});
exports["default"] = mongoose_1["default"].model("Feedback", FeedbackSchema);
