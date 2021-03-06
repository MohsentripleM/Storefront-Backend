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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = exports.order_status = void 0;
// @ts-ignore
var database_1 = __importDefault(require("../database"));
var order_status;
(function (order_status) {
    order_status["ordered"] = "ordered";
    order_status["ready"] = "ready";
    order_status["delivered"] = "delivered";
    order_status["canceled"] = "canceled";
})(order_status = exports.order_status || (exports.order_status = {}));
var OrderStore = /** @class */ (function () {
    function OrderStore() {
    }
    OrderStore.prototype.index = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conn, sql, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        sql = "SELECT * FROM orders";
                        return [4 /*yield*/, conn.query(sql)];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows];
                    case 3:
                        err_1 = _a.sent();
                        throw new Error("Could not get orders. Error: ".concat(err_1));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.show = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "SELECT * FROM orders WHERE id=($1)";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        result = _a.sent();
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 3:
                        err_2 = _a.sent();
                        throw new Error("Could not get Order ".concat(id, ". Error: ").concat(err_2));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.create = function (o) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, order, sql, conn, result, order, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 8, , 9]);
                        if (!(o.status && o.user_id)) return [3 /*break*/, 3];
                        sql = "INSERT INTO orders (status, user_id) VALUES($1, $2) RETURNING *;";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [o.status, o.user_id])];
                    case 2:
                        result = _a.sent();
                        order = result.rows[0];
                        conn.release();
                        return [2 /*return*/, order];
                    case 3:
                        if (!o.user_id) return [3 /*break*/, 6];
                        sql = "INSERT INTO orders  (user_id) VALUES($1) RETURNING *;";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 4:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [o.user_id])];
                    case 5:
                        result = _a.sent();
                        order = result.rows[0];
                        return [2 /*return*/, order];
                    case 6: return [2 /*return*/, null];
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        err_3 = _a.sent();
                        throw new Error("Could not add Order ".concat(o.user_id, ". Error: ").concat(err_3));
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.delete = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, conn, result, order, err_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        sql = "DELETE FROM orders WHERE id=($1) RETURNING *";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(sql, [id])];
                    case 2:
                        result = _a.sent();
                        order = result.rows[0];
                        conn.release();
                        return [2 /*return*/, order];
                    case 3:
                        err_4 = _a.sent();
                        throw new Error("Could not delete Order ".concat(id, ". Error: ").concat(err_4));
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.addNewProduct = function (newProduct) {
        return __awaiter(this, void 0, void 0, function () {
            var checkSQL, sql, conn, order, result, err_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        checkSQL = "SELECT * from orders where id=$1";
                        sql = "INSERT INTO order_products (order_id,product_id,quantity) VALUES($1, $2, $3) RETURNING *";
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        return [4 /*yield*/, conn.query(checkSQL, [newProduct.order_id])];
                    case 2:
                        order = (_a.sent())
                            .rows[0];
                        if (!(order.status.toString() == order_status.delivered.toString() ||
                            order.status.toString() == order_status.canceled.toString())) return [3 /*break*/, 3];
                        throw new Error("can not add product to ".concat(order.status, " orders"));
                    case 3: return [4 /*yield*/, conn.query(sql, [
                            newProduct.order_id,
                            newProduct.product_id,
                            newProduct.quantity,
                        ])];
                    case 4:
                        result = _a.sent();
                        console.log(result);
                        conn.release();
                        return [2 /*return*/, result.rows[0]];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        err_5 = _a.sent();
                        console.log(err_5);
                        throw new Error("Could not add Order ".concat(newProduct.product_id, ". Error: ").concat(err_5));
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    OrderStore.prototype.updateOrder = function (orderID, userID, status) {
        return __awaiter(this, void 0, void 0, function () {
            var sql, result, conn, updatedOrder, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 9, , 10]);
                        sql = void 0, result = void 0;
                        return [4 /*yield*/, database_1.default.connect()];
                    case 1:
                        conn = _a.sent();
                        if (!(userID &&
                            typeof userID === "number" &&
                            status &&
                            typeof status === "string")) return [3 /*break*/, 3];
                        sql = "UPDATE orders SET user_id=$1, status=$2 WHERE id=$3 RETURNING *";
                        return [4 /*yield*/, conn.query(sql, [userID, status, orderID])];
                    case 2:
                        result = _a.sent();
                        return [3 /*break*/, 8];
                    case 3:
                        if (!(userID && typeof userID === "number")) return [3 /*break*/, 5];
                        sql = "UPDATE orders SET user_id=$1 WHERE id=$2 RETURNING *";
                        return [4 /*yield*/, conn.query(sql, [userID, orderID])];
                    case 4:
                        result = _a.sent();
                        return [3 /*break*/, 8];
                    case 5:
                        if (!(status && typeof status === "string")) return [3 /*break*/, 7];
                        sql = "UPDATE orders SET  status=$1 WHERE id=$2 RETURNING *";
                        return [4 /*yield*/, conn.query(sql, [status, orderID])];
                    case 6:
                        result = _a.sent();
                        return [3 /*break*/, 8];
                    case 7: throw new Error("missing parameters");
                    case 8:
                        updatedOrder = result.rows[0];
                        conn.release();
                        return [2 /*return*/, updatedOrder];
                    case 9:
                        err_6 = _a.sent();
                        throw new Error("Could not update Order ".concat(orderID, ". Error: ").concat(err_6));
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    return OrderStore;
}());
exports.OrderStore = OrderStore;
