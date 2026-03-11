"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("../Middlewares/Auth"));
const messageController_1 = require("../Controllers/messageController");
const router = express_1.default.Router();
router.post("/", Auth_1.default, messageController_1.sendMessage);
router.get("/:conversationId", Auth_1.default, messageController_1.getMessages);
router.put("/read/:conversationId", Auth_1.default, messageController_1.markAsRead);
exports.default = router;
