"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var permitAdmin = function (req, res, next) {
    try {
        var headerAuthorization = req.headers.authorization;
        var token = headerAuthorization.split(" ")[1];
        var user = jsonwebtoken_1.default.decode(token).data;
        if (user.role == "admin") {
            return next();
        }
        else {
            throw new Error("not authorized login");
        }
    }
    catch (err) {
        res.sendStatus(403);
    }
};
exports.default = permitAdmin;
