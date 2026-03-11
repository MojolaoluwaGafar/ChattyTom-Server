"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signin = exports.signup = void 0;
const AuthService_1 = require("../Services/AuthService");
const signup = async (req, res) => {
    try {
        const { email, firstName, lastName, password } = req.body;
        if (!email || !firstName || !lastName || !password) {
            res.status(400).json({ error: "All fields are required" });
            return;
        }
        const user = await (0, AuthService_1.registerUser)(email, firstName, lastName, password);
        res.status(201).json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            created_at: user.created_at,
        });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.signup = signup;
const signin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: "Email and password required" });
            return;
        }
        const response = await (0, AuthService_1.loginUser)(email, password);
        res.json(response);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.signin = signin;
