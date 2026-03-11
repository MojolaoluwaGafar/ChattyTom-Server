"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const UserModel_1 = require("../Models/UserModel");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const signup = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        if (!firstName || !lastName || !email || !password) {
            res.status(400).json({
                error: "All fields are required"
            });
            return;
        }
        const existingUser = await (0, UserModel_1.findUserByEmail)(email);
        if (existingUser) {
            res.status(400).json({
                error: "User already exists"
            });
            return;
        }
        const user = await (0, UserModel_1.createUser)(email, firstName, lastName, password);
        console.log(user);
        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            created_at: user.created_at,
        });
    }
    catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                error: "Email and Password are required"
            });
            return;
        }
        const user = await (0, UserModel_1.findUserByEmail)(email);
        if (!user || !user.password) {
            res.status(400).json({
                error: "Invalid credentials"
            });
            return;
        }
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
                error: "Invalid credentials"
            });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
            }
        });
        console.log(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};
exports.signin = signin;
