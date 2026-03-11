"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserModel_1 = require("../Models/UserModel");
const JWT_SECRET = process.env.JWT_SECRET;
const registerUser = async (email, firstName, lastName, password) => {
    const existingUser = await (0, UserModel_1.findUserByEmail)(email);
    if (existingUser) {
        throw new Error("User already exists");
    }
    const user = await (0, UserModel_1.createUser)(email, firstName, lastName, password);
    return user;
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await (0, UserModel_1.findUserByEmail)(email);
    if (!user || !user.password) {
        throw new Error("Invalid credentials");
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
    });
    return {
        token,
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },
    };
};
exports.loginUser = loginUser;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
