"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = __importDefault(require("dotenv"));
var pg_1 = require("pg");
dotenv_1.default.config();
var _a = process.env, ENV = _a.ENV, POSTGRES_TEST_DB = _a.POSTGRES_TEST_DB, POSTGRES_HOST = _a.POSTGRES_HOST, POSTGRES_DB = _a.POSTGRES_DB, POSTGRES_USER = _a.POSTGRES_USER, POSTGRES_PASSWORD = _a.POSTGRES_PASSWORD;
var client;
if (ENV === "dev") {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_DB,
        password: POSTGRES_PASSWORD,
    });
}
else {
    client = new pg_1.Pool({
        host: POSTGRES_HOST,
        user: POSTGRES_USER,
        database: POSTGRES_TEST_DB,
        password: POSTGRES_PASSWORD,
    });
}
exports.default = client;
