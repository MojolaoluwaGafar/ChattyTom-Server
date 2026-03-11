"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ErrorHandler_1 = require("./Middlewares/ErrorHandler");
const userAuthRoutes_1 = __importDefault(require("./Routes/userAuthRoutes"));
const messageRoutes_1 = __importDefault(require("./Routes/messageRoutes"));
const conversationRoutes_1 = __importDefault(require("./Routes/conversationRoutes"));
dotenv_1.default.config();
exports.app = (0, express_1.default)();
// const PORT = process.env.PORT
//middlewares
exports.app.use((0, cors_1.default)());
exports.app.use(express_1.default.json());
//routes
//test route
exports.app.get("/", (req, res) => {
    res.status(200).json({
        message: "ChattyTom Backend running"
    });
});
exports.app.use("/auth", userAuthRoutes_1.default);
exports.app.use("/message", messageRoutes_1.default);
exports.app.use("/conversation", conversationRoutes_1.default);
//global error handler
exports.app.use(ErrorHandler_1.errorHandler);
//establish connection
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
