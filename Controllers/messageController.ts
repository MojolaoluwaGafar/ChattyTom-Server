import { Response } from "express";
import { SendMessage, getMessagesWithParticipants, markConversationAsRead } from "../Services/MessageService";
import { AuthRequest } from "../types/AuthRequest";

// send message
export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const senderId = req.userId;
    if (!senderId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { conversationId, content } = req.body;

    if (!conversationId || !content) {
      return res.status(400).json({ error: "conversationId and content required" });
    }

    const message = await SendMessage(conversationId, senderId, content);
    return res.status(201).json(message);

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// get messages
export const getMessages = async (
  req: AuthRequest<{ conversationId: string }>,
  res: Response
) => {
  try {
    const { conversationId } = req.params;

    const data = await getMessagesWithParticipants(conversationId);
    return res.json(data);

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};

// mark as read
export const markAsRead = async (
  req: AuthRequest<{ conversationId: string }>,
  res: Response
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { conversationId } = req.params;

    await markConversationAsRead(conversationId, userId);
    return res.json({ message: "Conversation marked as read" });

  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
};