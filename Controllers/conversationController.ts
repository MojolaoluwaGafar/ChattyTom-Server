import { Request, Response } from "express";
import {
  createOneToOneConversation,
  createGroupConversation,
  getUserConversations,
  getConversationById,
} from "../Services/ConversationService";

// 1-on-1 conversation
export const createOneToOne = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const otherUserId = Number(req.body.otherUserId);
    if (isNaN(otherUserId))
      return res.status(400).json({ error: "otherUserId is required and must be a number" });

    const conversation = await createOneToOneConversation(userId, otherUserId);
   
    res.status(201).json(conversation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Group conversation
export const createGroup = async (req: Request, res: Response) => {
  try {
    const creatorId = req.userId;
    if (!creatorId) return res.status(401).json({ error: "Unauthorized" });

    const { name, members } = req.body;
    if (!name || !Array.isArray(members))
      return res.status(400).json({ error: "Group name and members array required" });

    const numericMembers = members.map(Number);
    if (numericMembers.some(isNaN))
      return res.status(400).json({ error: "All member IDs must be numbers" });

    const groupConversation = await createGroupConversation(name, creatorId, numericMembers);
    
    res.status(201).json(groupConversation);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get logged-in user's conversations for chat list
export const getMyConversations = async (req: Request, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const conversations = await getUserConversations(userId);
    
    res.json(conversations);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

// Get single conversation by ID
export const getASingleConversation = async (req: Request <{ id: string}>, res: Response) => {
  try {
    const conversationId = req.params.id;
    if (!conversationId)
      return res.status(400).json({ error: "Conversation id is required" });

    const conversation = await getConversationById(conversationId);
    
    res.json(conversation); 
  } catch (error: any) {
    console.error("GET CONVERSATION ERROR:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};