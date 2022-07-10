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
var database_1 = __importDefault(require("../database"));
var user_1 = require("../models/user");
var product_1 = require("../models/product");
var order_1 = require("../models/order");
var userTest = new user_1.UserStore();
var productTest = new product_1.ProductStore();
var orderTest = new order_1.OrderStore();
var userID;
var createdOrder;
describe("testing models", function () {
    afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var conn, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.default.connect()];
                case 1:
                    conn = _a.sent();
                    sql = "DELETE FROM order_products; ALTER SEQUENCE order_products_id_seq RESTART WITH 1; DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1; DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;  DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;";
                    return [4 /*yield*/, conn.query(sql)];
                case 2:
                    _a.sent();
                    conn.release();
                    return [2 /*return*/];
            }
        });
    }); });
    describe("User Model", function () {
        it("should have an index method", function () {
            expect(userTest.index).toBeDefined();
        });
        it("should have a show method", function () {
            expect(userTest.show).toBeDefined();
        });
        it("should have a create method", function () {
            expect(userTest.create).toBeDefined();
        });
        it("should have a delete method", function () {
            expect(userTest.delete).toBeDefined();
        });
        it("should have a authenticate method", function () {
            expect(userTest.authenticate).toBeDefined();
        });
        it("should have a update method", function () {
            expect(userTest.update).toBeDefined();
        });
        describe("Test User Model Logic", function () {
            var user = {
                firstname: "Mahmoud",
                lastname: "Mamdouh",
                password: "p@$$w0rd",
                role: "user",
            };
            beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var createduser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userTest.create(user.firstname, user.lastname, user.password)];
                        case 1:
                            createduser = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var conn, sql;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.default.connect()];
                        case 1:
                            conn = _a.sent();
                            sql = "DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;";
                            return [4 /*yield*/, conn.query(sql)];
                        case 2:
                            _a.sent();
                            conn.release();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("index method should get all users", function () { return __awaiter(void 0, void 0, void 0, function () {
                var allUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userTest.index()];
                        case 1:
                            allUsers = _a.sent();
                            expect(allUsers).toEqual([{
                                    id: 1,
                                    firstname: 'Mahmoud',
                                    lastname: 'Mamdouh'
                                }]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("show method should show user details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var allUsers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userTest.show("1")];
                        case 1:
                            allUsers = _a.sent();
                            console.log(allUsers);
                            expect(allUsers).toEqual({
                                id: 1,
                                firstname: 'Mahmoud',
                                lastname: 'Mamdouh',
                                role: 'user'
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it("create method should add user", function () { return __awaiter(void 0, void 0, void 0, function () {
                var createdUser, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createdUser = {
                                firstname: "Ahmed",
                                lastname: "Ali",
                                password: "p@$$w0rd2",
                                role: "user",
                            };
                            return [4 /*yield*/, userTest.create(createdUser.firstname, createdUser.lastname, createdUser.password)];
                        case 1:
                            result = _a.sent();
                            expect(result).toBeGreaterThan(0);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("update method should update user data", function () { return __awaiter(void 0, void 0, void 0, function () {
                var firstnameUpdate, lastnameUpdate, roleUpdate, updatedUserID, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            firstnameUpdate = "Ali";
                            lastnameUpdate = "Hassan";
                            roleUpdate = "admin";
                            updatedUserID = 2;
                            return [4 /*yield*/, userTest.update(updatedUserID, firstnameUpdate, lastnameUpdate, roleUpdate)];
                        case 1:
                            result = _a.sent();
                            expect(result.firstname).toEqual("Ali");
                            expect(result.lastname).toEqual("Hassan");
                            expect(result.role).toEqual("admin");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("delete method should delete user", function () { return __awaiter(void 0, void 0, void 0, function () {
                var deletedUser;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userTest.delete(2)];
                        case 1:
                            deletedUser = _a.sent();
                            expect(deletedUser).toEqual({
                                firstname: "Ali",
                                lastname: "Hassan",
                                id: 2
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("Product Model", function () {
        it("should have an index method", function () {
            expect(productTest.index).toBeDefined();
        });
        it("should have a show method", function () {
            expect(productTest.show).toBeDefined();
        });
        it("should have a create method", function () {
            expect(productTest.create).toBeDefined();
        });
        it("should have a delete method", function () {
            expect(productTest.delete).toBeDefined();
        });
        it("should have a update method", function () {
            expect(productTest.update).toBeDefined();
        });
        describe("Test Product Model Logic", function () {
            var product = {
                name: "blanket",
                price: 500,
            };
            var productID;
            beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var createdProduct;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productTest.create(product)];
                        case 1:
                            createdProduct = _a.sent();
                            return [2 /*return*/];
                    }
                });
            }); });
            afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var conn, sql;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.default.connect()];
                        case 1:
                            conn = _a.sent();
                            sql = "DELETE FROM products; ALTER SEQUENCE products_id_seq RESTART WITH 1;";
                            return [4 /*yield*/, conn.query(sql)];
                        case 2:
                            _a.sent();
                            conn.release();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("index method should get all Products", function () { return __awaiter(void 0, void 0, void 0, function () {
                var allProducts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productTest.index()];
                        case 1:
                            allProducts = _a.sent();
                            expect(allProducts).toEqual([{
                                    id: 2,
                                    name: 'blanket',
                                    price: 500
                                }]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("show method should show Product details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productTest.show("2")];
                        case 1:
                            result = _a.sent();
                            console.log(result);
                            expect(result).toEqual({
                                id: 2,
                                name: 'blanket',
                                price: 500
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it("create method should add product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var createdProduct, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createdProduct = {
                                name: "LCD",
                                price: 9000,
                            };
                            return [4 /*yield*/, productTest.create(createdProduct)];
                        case 1:
                            result = _a.sent();
                            expect(result.name).toEqual("LCD");
                            expect(result.price).toEqual(9000);
                            productID = result.id;
                            return [2 /*return*/];
                    }
                });
            }); });
            it("update method should update product data", function () { return __awaiter(void 0, void 0, void 0, function () {
                var productNameUpdate, priceUpdate, updatedProductID, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            productNameUpdate = "UPS";
                            priceUpdate = "5000";
                            updatedProductID = productID;
                            return [4 /*yield*/, productTest.update(updatedProductID, productNameUpdate, parseInt(priceUpdate))];
                        case 1:
                            result = _a.sent();
                            expect(result.name).toEqual("UPS");
                            expect(result.price).toEqual(5000);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("delete method should delete Product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var deletedProduct;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, productTest.delete(productID)];
                        case 1:
                            deletedProduct = _a.sent();
                            expect(deletedProduct).toEqual({
                                id: productID,
                                name: "UPS",
                                price: 5000,
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
    describe("Order Model", function () {
        it("should have an index method", function () {
            expect(orderTest.index).toBeDefined();
        });
        it("should have a show method", function () {
            expect(orderTest.show).toBeDefined();
        });
        it("should have a create method", function () {
            expect(orderTest.create).toBeDefined();
        });
        it("should have a delete method", function () {
            expect(orderTest.delete).toBeDefined();
        });
        it("should have a update method", function () {
            expect(orderTest.updateOrder).toBeDefined();
        });
        it("should have add new product method", function () {
            expect(orderTest.addNewProduct).toBeDefined();
        });
        describe("Test Order Model Logic", function () {
            var orderID;
            var order = {
                user_id: 1,
                status: order_1.order_status.ordered,
            };
            var user = {
                firstname: "Mahmoud",
                lastname: "Alaa",
                password: "p@$$w0rd",
                role: "user",
            };
            var product = {
                name: "blanket",
                price: 500,
            };
            var productID;
            beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var createdProduct;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, userTest.create(user.firstname, user.lastname, user.password)];
                        case 1:
                            userID = (_a.sent());
                            return [4 /*yield*/, orderTest.create(order)];
                        case 2:
                            createdOrder = (_a.sent());
                            return [4 /*yield*/, productTest.create(product)];
                        case 3:
                            createdProduct = _a.sent();
                            productID = createdProduct.id;
                            return [2 /*return*/];
                    }
                });
            }); });
            afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
                var conn, sql;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, database_1.default.connect()];
                        case 1:
                            conn = _a.sent();
                            sql = "DELETE FROM orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;";
                            return [4 /*yield*/, conn.query(sql)];
                        case 2:
                            _a.sent();
                            conn.release();
                            return [2 /*return*/];
                    }
                });
            }); });
            it("index method should get all orders", function () { return __awaiter(void 0, void 0, void 0, function () {
                var allOrders;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, orderTest.index()];
                        case 1:
                            allOrders = _a.sent();
                            expect(allOrders).toEqual([{
                                    id: 2,
                                    user_id: 1,
                                    status: "ordered"
                                }]);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("show method should show Order details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, orderTest.show(2)];
                        case 1:
                            result = _a.sent();
                            console.log(result);
                            expect(result).toEqual({
                                id: 2,
                                user_id: 1,
                                status: "ordered",
                            });
                            return [2 /*return*/];
                    }
                });
            }); });
            it("create method should add order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var createdorder, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            createdorder = {
                                user_id: userID,
                                status: order_1.order_status.ready,
                            };
                            return [4 /*yield*/, orderTest.create(createdorder)];
                        case 1:
                            result = (_a.sent());
                            expect(result.user_id).toEqual(userID);
                            expect(result.status).toEqual("ready");
                            orderID = result.id;
                            console.log(result);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("update method should update order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var orderUserID, updatedOrderID, updateResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            orderUserID = userID;
                            updatedOrderID = orderID;
                            return [4 /*yield*/, orderTest.updateOrder(updatedOrderID, orderUserID, order_1.order_status.ordered)];
                        case 1:
                            updateResult = _a.sent();
                            console.log(updateResult);
                            expect(updateResult.user_id).toEqual(userID);
                            expect(updateResult.status).toBe("ordered");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("addProduct method should add a product to the order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var newProduct, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            newProduct = {
                                order_id: orderID,
                                product_id: productID,
                                quantity: 3,
                            };
                            return [4 /*yield*/, orderTest.addNewProduct(newProduct)];
                        case 1:
                            result = _a.sent();
                            expect(result.order_id).toEqual(orderID);
                            expect(result.product_id).toEqual(productID);
                            expect(result.quantity).toEqual(3);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("delete method should delete Order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var deletedOrder;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, orderTest.delete(orderID)];
                        case 1:
                            deletedOrder = _a.sent();
                            expect(deletedOrder.id).toEqual(orderID);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
