"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AuthService_1 = require("../Services/AuthService");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(" ")[1];
    if (!token)
        return res.status(401).json({ error: "Unauthorized" });
    try {
        const decoded = (0, AuthService_1.verifyToken)(token);
        req.userId = decoded.userId;
        next();
    }
    catch (err) {
        res.status(401).json({ error: "Invalid token" });
    }
};
exports.default = authMiddleware;
