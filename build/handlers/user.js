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
var user_1 = require("../models/user");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var permitUser_1 = __importDefault(require("../Middlewares/permitUser"));
var permitAdmin_1 = __importDefault(require("../Middlewares/permitAdmin"));
var tokenSecret = process.env.TOKEN_SECRET;
dotenv_1.default.config();
var store = new user_1.UserStore();
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, store.index()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400).send(err_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var create = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstname, lastname, password, newUserID, token, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                password = req.body.password;
                if (!(firstname &&
                    lastname &&
                    password &&
                    typeof firstname == "string" &&
                    typeof lastname == "string" &&
                    typeof password == "string")) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.create(firstname, lastname, password)];
            case 2:
                newUserID = _a.sent();
                // check request validation
                if (newUserID) {
                    token = jsonwebtoken_1.default.sign({
                        data: {
                            firstname: firstname,
                            lastname: lastname,
                            id: newUserID,
                            role: "user",
                        },
                    }, tokenSecret);
                    res.json({
                        firstname: firstname,
                        lastname: lastname,
                        id: newUserID,
                        role: "user",
                        token: token,
                    });
                }
                else {
                    res.status(500).send("The username is already used.");
                }
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res
                    .status(400)
                    .send("bad request. please send unique cobination of (firstname and last name) and  a valid password");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var destroy = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, deleted, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id);
                if (!id) return [3 /*break*/, 5];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.delete(id)];
            case 2:
                deleted = _a.sent();
                if (deleted) {
                    res.json(deleted);
                }
                else {
                    res.status(404).send("Not found");
                }
                return [3 /*break*/, 4];
            case 3:
                err_3 = _a.sent();
                res.status(400).send(err_3);
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                res.status(400).send("bad request");
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); };
var authenticate = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var firstname, lastname, password, loginigUser, token, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                password = req.body.password;
                if (!(firstname &&
                    lastname &&
                    password &&
                    typeof firstname == "string" &&
                    typeof lastname == "string" &&
                    typeof password == "string")) return [3 /*break*/, 4];
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, store.authenticate(firstname, lastname, password)];
            case 2:
                loginigUser = _a.sent();
                console.log(loginigUser);
                if (loginigUser) {
                    token = jsonwebtoken_1.default.sign({
                        data: {
                            firstname: loginigUser.firstname,
                            lastname: loginigUser.lastname,
                            id: loginigUser.id,
                            role: loginigUser.role,
                        },
                    }, tokenSecret);
                    res.json({
                        firstname: loginigUser.firstname,
                        lastname: loginigUser.lastname,
                        id: loginigUser.id,
                        role: loginigUser.role,
                        token: token,
                    });
                }
                else {
                    res.status(400).send("invalid login");
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.sendStatus(500);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var show = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.show(req.params.id)];
            case 1:
                user = _a.sent();
                res.json(user);
                return [2 /*return*/];
        }
    });
}); };
var update = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, firstname, lastname, role, updatedUser, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id);
                if (!id) return [3 /*break*/, 7];
                firstname = req.body.firstname;
                lastname = req.body.lastname;
                role = req.body.role;
                console.log(role);
                if (!!("firstname" in req.body || "lastname" in req.body || "role" in req.body)) return [3 /*break*/, 1];
                res.status(400).send("missing parameters");
                return [3 /*break*/, 6];
            case 1:
                if (!(("firstname" in req.body && typeof firstname !== "string") ||
                    ("lastname" in req.body && typeof lastname !== "string"))) return [3 /*break*/, 2];
                res.status(400).send("firstname and lastname must be string  ");
                return [3 /*break*/, 6];
            case 2:
                if (!("role" in req.body && role !== "user" && role !== "admin")) return [3 /*break*/, 3];
                res.status(400).send("role must be user or admin");
                return [3 /*break*/, 6];
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, store.update(id, firstname, lastname, role)];
            case 4:
                updatedUser = _a.sent();
                res.json({
                    firstname: updatedUser.firstname,
                    lastname: updatedUser.lastname,
                    id: updatedUser.id,
                    role: updatedUser.role,
                });
                return [3 /*break*/, 6];
            case 5:
                err_5 = _a.sent();
                res.sendStatus(500);
                return [3 /*break*/, 6];
            case 6: return [3 /*break*/, 8];
            case 7:
                res.status(404).send("user in not found");
                _a.label = 8;
            case 8: return [2 /*return*/];
        }
    });
}); };
var userRoutes = function (app) {
    app.get("/users", permitUser_1.default, permitAdmin_1.default, index);
    app.get("/users/:id", permitUser_1.default, permitAdmin_1.default, show);
    app.post("/users", create);
    app.delete("/users/:id", permitUser_1.default, permitAdmin_1.default, destroy);
    app.post("/authentication", authenticate);
    app.patch("/users/:id", permitUser_1.default, permitAdmin_1.default, update);
};
exports.default = userRoutes;
