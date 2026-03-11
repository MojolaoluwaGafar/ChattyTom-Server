"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Auth_1 = __importDefault(require("../Middlewares/Auth"));
const conversationController_1 = require("../Controllers/conversationController");
const router = express_1.default.Router();
router.post("/one-to-one", Auth_1.default, conversationController_1.createOneToOne);
router.post("/group", Auth_1.default, conversationController_1.createGroup);
router.get("/", Auth_1.default, conversationController_1.getMyConversations);
router.get("/:id", Auth_1.default, conversationController_1.getConversation);
exports.default = router;
