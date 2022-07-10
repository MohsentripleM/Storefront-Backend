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
var supertest_1 = __importDefault(require("supertest"));
var __1 = __importDefault(require(".."));
var database_1 = __importDefault(require("../database"));
var user_1 = require("../models/user");
var request = (0, supertest_1.default)(__1.default);
var userToken = "";
var adminToken = "";
var tempUserID;
var tempProductID;
var tempOrderID;
var createdUserID;
var createdAdminID;
var userTest = new user_1.UserStore();
var pepper = process.env.BCRYPT_SECRET;
var rounds = process.env.SALT_ROUND;
var wrongName = "Wong Name";
var wrongPass = "Wong Password";
describe("Testing end point", function () {
    var user = {
        firstname: "user1name",
        lastname: "user2name",
        password: "p@$$w0rd",
        role: "user",
    };
    var admin = {
        firstname: "admin1name",
        lastname: "admin2name",
        password: "p@$$w0rd",
        role: "admin",
    };
    // creating admin user and normal user to test them
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        var createdUser, createdAdmin, conn, sql;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, userTest.create(user.firstname, user.lastname, user.password)];
                case 1:
                    createdUser = _a.sent();
                    createdUserID = createdUser;
                    return [4 /*yield*/, userTest.create(admin.firstname, admin.lastname, admin.password)];
                case 2:
                    createdAdmin = _a.sent();
                    createdAdminID = createdAdmin;
                    return [4 /*yield*/, database_1.default.connect()];
                case 3:
                    conn = _a.sent();
                    sql = "UPDATE users SET role='admin' WHERE firstname = 'admin1name' AND lastname='admin2name'";
                    return [4 /*yield*/, conn.query(sql)];
                case 4:
                    _a.sent();
                    conn.release();
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
    describe("Test all users routes", function () {
        it("should authenticate and get user token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request
                            .post("/authentication")
                            .set("Content-type", "application/json")
                            .send({
                            firstname: "user1name",
                            lastname: "user2name",
                            password: "p@$$w0rd",
                        })];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.body.id).toBe(1);
                        expect(response.body.firstname).toBe("user1name");
                        expect(response.body.lastname).toBe("user2name");
                        expect(response.body.role).toBe("user");
                        userToken = response.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it("should authenticate and get admin token", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request
                            .post("/authentication")
                            .set("Content-type", "application/json")
                            .send({
                            firstname: "admin1name",
                            lastname: "admin2name",
                            password: "p@$$w0rd",
                        })];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(200);
                        expect(response.body.id).toBe(2);
                        expect(response.body.firstname).toBe("admin1name");
                        expect(response.body.lastname).toBe("admin2name");
                        expect(response.body.role).toBe("admin");
                        adminToken = response.body.token;
                        return [2 /*return*/];
                }
            });
        }); });
        it("should fail to authenticate", function () { return __awaiter(void 0, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, request
                            .post("/authentication")
                            .set("Content-type", "application/json")
                            .send({
                            firstname: wrongName,
                            lastname: wrongName,
                            password: wrongPass,
                        })];
                    case 1:
                        response = _a.sent();
                        expect(response.status).toBe(400);
                        expect(response.text).toBe("invalid login");
                        return [2 /*return*/];
                }
            });
        }); });
        describe("Test all users routes", function () {
            it("should create user", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .post("/users")
                                .set("Content-type", "application/json")
                                .send({
                                firstname: "user3",
                                lastname: "user33",
                                password: "p@$$w0rd",
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.id).toBe(3);
                            expect(response.body.firstname).toBe("user3");
                            expect(response.body.lastname).toBe("user33");
                            expect(response.body.role).toBe("user");
                            tempUserID = response.body.id;
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should update user", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .patch("/users/1")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))
                                .send({
                                firstname: "firstname update",
                                lastname: "lastname update",
                                role: "admin",
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.id).toBe(1);
                            expect(response.body.firstname).toBe("firstname update");
                            expect(response.body.lastname).toBe("lastname update");
                            expect(response.body.role).toBe("admin");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should get all users", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/users")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not get all users", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/users")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should get user details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/users/1")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not get user details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/users")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should delete users", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/users/".concat(tempUserID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.body.id).toBe(tempUserID);
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should not delete not found user", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/users/".concat(tempUserID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(404);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not delete users", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/users/2")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("Test all product routes", function () {
            it("only admin should create product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .post("/products")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))
                                .send({
                                name: "product1",
                                price: 500,
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.name).toBe("product1");
                            expect(response.body.price).toBe(500);
                            tempProductID = response.body.id;
                            return [2 /*return*/];
                    }
                });
            }); });
            it(" should update product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .patch("/products/".concat(tempProductID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))
                                .send({
                                name: "product new name",
                                price: 9999,
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.name).toBe("product new name");
                            expect(response.body.price).toBe(9999);
                            expect(response.body.id).toBe(tempProductID);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not create product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .post("/products")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("any one should get all productss", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/products")
                                .set("Content-type", "application/json")];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("you should be user to get product details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/products/".concat(tempProductID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should delete a product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/products/".concat(tempProductID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.body.id).toBe(tempProductID);
                            expect(response.body.name).toBe("product new name");
                            expect(response.body.price).toBe(9999);
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should not delete not found product", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/products/100")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(404);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not delete products", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/products/".concat(tempProductID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
        describe("Test all order routes", function () {
            it("only user should create order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .post("/orders")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))
                                .send({
                                user_id: createdUserID,
                                status: "ordered",
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.user_id).toBe(createdUserID);
                            expect(response.body.status).toBe("ordered");
                            tempOrderID = response.body.id;
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should update order status and user id", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .patch("/orders/".concat(tempOrderID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))
                                .send({
                                user_id: createdUserID,
                                status: "delivered",
                            })];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.user_id).toBe(createdUserID);
                            expect(response.body.status).toBe("delivered");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not get all orders", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/orders")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should get all orders", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/orders")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should get order details", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .get("/orders/".concat(tempOrderID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            expect(response.body.user_id).toBe(createdUserID);
                            expect(response.body.status).toBe("delivered");
                            return [2 /*return*/];
                    }
                });
            }); });
            it("only admin should delete an order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/orders/".concat(tempOrderID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(200);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("should not delete not found order", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/orders/100")
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(adminToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(404);
                            return [2 /*return*/];
                    }
                });
            }); });
            it("user should not delete orders", function () { return __awaiter(void 0, void 0, void 0, function () {
                var response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, request
                                .delete("/orders/".concat(tempOrderID))
                                .set("Content-type", "application/json")
                                .set("Authorization", "Bearer ".concat(userToken))];
                        case 1:
                            response = _a.sent();
                            expect(response.status).toBe(403);
                            return [2 /*return*/];
                    }
                });
            }); });
        });
    });
});
