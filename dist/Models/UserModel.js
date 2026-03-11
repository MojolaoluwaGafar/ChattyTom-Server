"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = exports.findUserByEmail = exports.createUser = void 0;
const Db_1 = __importDefault(require("../Config/Db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
//map models to database schema (define schema)
//creating actual tables and migrations
//that correspond to user interface
//this sets the foundation for crud operations
//create a new user in database
const createUser = async (email, firstName, lastName, password) => {
    const hashedPassword = await bcrypt_1.default.hash(password, 12);
    //use the connection pool to run a sql query
    const res = await Db_1.default.query("INSERT INTO users (email, firstName, lastName, password) VALUES ($1,$2,$3,$4) RETURNING *", [email, firstName, lastName, hashedPassword]);
    return res.rows[0];
};
exports.createUser = createUser;
//look up user in database
const findUserByEmail = async (email) => {
    const res = await Db_1.default.query("SELECT * FROM users WHERE email=$1", [email]);
    return res.rows[0] || null;
};
exports.findUserByEmail = findUserByEmail;
const findUserById = async (id) => {
    const res = await Db_1.default.query("SELECT id, email,firstName, lastName, created_at FROM users WHERE id=$1", [id]);
    return res.rows[0] || null;
};
exports.findUserById = findUserById;
