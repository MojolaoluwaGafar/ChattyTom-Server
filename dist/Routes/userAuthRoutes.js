"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuthController_1 = require("../Controllers/userAuthController");
// import authMiddleware from "../Middlewares/Auth"
const router = express_1.default.Router();
router.post("/signup", userAuthController_1.signup);
router.post("/signin", userAuthController_1.signin);
exports.default = router;
