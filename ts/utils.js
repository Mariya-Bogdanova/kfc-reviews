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
exports.__esModule = true;
exports.changeParams = exports.updateDB = exports.path = void 0;
var axios_1 = require("axios");
var db_1 = require("./db");
var path = function (limit, offset) {
    return "https://api.delivery-club.ru/api1.2/reviews?chainId=48274&limit=".concat(limit, "&offset=").concat(offset);
};
exports.path = path;
function updateDB() {
    return __awaiter(this, void 0, void 0, function () {
        var lastFeedback, reqIncudesLast, newFeedbacks, i, reviews, filterFeedbacks;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1["default"].findOne().sort({
                        date: -1
                    })];
                case 1:
                    lastFeedback = _a.sent();
                    if (!lastFeedback) return [3 /*break*/, 7];
                    reqIncudesLast = false;
                    newFeedbacks = [];
                    i = 0;
                    _a.label = 2;
                case 2: return [4 /*yield*/, (0, axios_1["default"])((0, exports.path)(10, "".concat(i, "0")))];
                case 3:
                    reviews = (_a.sent()).data.reviews;
                    reqIncudesLast = reviews.some(function (_a) {
                        var orderHash = _a.orderHash;
                        return orderHash === lastFeedback.id;
                    });
                    filterFeedbacks = reviews.filter(function (_a) {
                        var rated = _a.rated;
                        return new Date(rated) > lastFeedback.date;
                    });
                    newFeedbacks.push.apply(newFeedbacks, changeParams(filterFeedbacks));
                    if (reqIncudesLast)
                        return [3 /*break*/, 5];
                    _a.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, db_1["default"].insertMany(newFeedbacks)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.updateDB = updateDB;
function changeParams(arr) {
    return arr.map(function (_a) {
        var _b, _c;
        var answers = _a.answers, author = _a.author, body = _a.body, icon = _a.icon, rated = _a.rated, orderHash = _a.orderHash;
        return ({
            answer: ((_c = (_b = answers[0]) === null || _b === void 0 ? void 0 : _b.answer) === null || _c === void 0 ? void 0 : _c.trim()) || "",
            author: author || "incognito",
            text: body.trim() || "",
            reting: icon.charCodeAt(1).toString(16) === "de0a" ? 5 : 1,
            date: new Date(rated),
            id: orderHash
        });
    });
}
exports.changeParams = changeParams;
