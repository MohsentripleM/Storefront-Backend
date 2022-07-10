"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
var tokenSecret = process.env.TOKEN_SECRET;
var permitUser = function (req, res, next) {
    try {
        var headerAuthorization = req.headers.authorization;
        var token = headerAuthorization.split(" ")[1];
        jsonwebtoken_1.default.verify(token, tokenSecret);
        return next();
    }
    catch (err) {
        res.sendStatus(403);
    }
};
exports.default = permitUser;
