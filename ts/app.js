"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _a;
exports.__esModule = true;
var express_1 = require("express");
var mongoose_1 = require("mongoose");
var db_1 = require("./db");
var utils_1 = require("./utils");
var consts_1 = require("./consts");
mongoose_1["default"].connect("mongodb://localhost:27017/feedback", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
var app = (0, express_1["default"])();
app.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, _b, limit, _c, offset, date, rating, _d, dateStart, _e, dateEnd, filtrByRating, reqSort, data;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                (0, utils_1.updateDB)();
                _a = req.query, _b = _a.limit, limit = _b === void 0 ? consts_1.LIMIT : _b, _c = _a.offset, offset = _c === void 0 ? consts_1.OFFSET : _c, date = _a.date, rating = _a.rating, _d = _a.dateStart, dateStart = _d === void 0 ? consts_1.DATESTART : _d, _e = _a.dateEnd, dateEnd = _e === void 0 ? consts_1.DATEEND : _e, filtrByRating = _a.filtrByRating;
                if (date) {
                    reqSort = { date: date };
                }
                else if (rating) {
                    reqSort = { rating: rating };
                }
                else {
                    reqSort = { date: -1 };
                }
                return [4 /*yield*/, db_1["default"].find({
                        $and: [
                            {
                                reting: filtrByRating || { $in: [1, 5] }
                            },
                            {
                                date: { $gte: new Date(dateStart), $lte: new Date(dateEnd) }
                            },
                        ]
                    }, { _id: 0, id: 0, __v: 0 })
                        .sort(reqSort)
                        .skip(offset)
                        .limit(limit)
                        .exec()];
            case 1:
                data = _f.sent();
                res.json(data);
                return [2 /*return*/];
        }
    });
}); });
app.listen((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
