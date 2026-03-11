import express from "express";
import authMiddleware from "../Middlewares/Auth";
import {
  createOneToOne,
  createGroup,
  getMyConversations,
  getASingleConversation,
} from "../Controllers/conversationController";

const router = express.Router();

router.post("/one-to-one", authMiddleware, createOneToOne);
router.post("/group", authMiddleware, createGroup);
router.get("/", authMiddleware, getMyConversations);
router.get("/:id", authMiddleware, getASingleConversation);

export default router;