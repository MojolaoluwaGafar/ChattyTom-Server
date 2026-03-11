import express from "express";
import authMiddleware from "../Middlewares/Auth";
import {
  sendMessage,
  getMessages,
  markAsRead,
} from "../Controllers/messageController";

const router = express.Router();

router.post("/", authMiddleware, sendMessage);
router.get("/:conversationId", authMiddleware, getMessages);
router.put("/read/:conversationId", authMiddleware, markAsRead);

export default router;