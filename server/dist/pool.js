"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = __importDefault(require("pg"));
const { Pool } = pg_1.default;
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'movieReviewDB',
    password: '12345678',
    port: 5432,
});
exports.default = pool;
