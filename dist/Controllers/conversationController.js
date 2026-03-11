"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getASingleConversation = exports.getMyConversations = exports.createGroup = exports.createOneToOne = void 0;
const ConversationService_1 = require("../Services/ConversationService");
// 1-on-1 conversation
const createOneToOne = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const otherUserId = Number(req.body.otherUserId);
        if (isNaN(otherUserId))
            return res.status(400).json({ error: "otherUserId is required and must be a number" });
        const conversation = await (0, ConversationService_1.createOneToOneConversation)(userId, otherUserId);
        res.status(201).json(conversation);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createOneToOne = createOneToOne;
// Group conversation
const createGroup = async (req, res) => {
    try {
        const creatorId = req.userId;
        if (!creatorId)
            return res.status(401).json({ error: "Unauthorized" });
        const { name, members } = req.body;
        if (!name || !Array.isArray(members))
            return res.status(400).json({ error: "Group name and members array required" });
        const numericMembers = members.map(Number);
        if (numericMembers.some(isNaN))
            return res.status(400).json({ error: "All member IDs must be numbers" });
        const groupConversation = await (0, ConversationService_1.createGroupConversation)(name, creatorId, numericMembers);
        res.status(201).json(groupConversation);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createGroup = createGroup;
// Get logged-in user's conversations for chat list
const getMyConversations = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).json({ error: "Unauthorized" });
        const conversations = await (0, ConversationService_1.getUserConversations)(userId);
        res.json(conversations);
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getMyConversations = getMyConversations;
// Get single conversation by ID
const getASingleConversation = async (req, res) => {
    try {
        const conversationId = req.params.id;
        if (!conversationId)
            return res.status(400).json({ error: "Conversation id is required" });
        const conversation = await (0, ConversationService_1.getConversationById)(conversationId);
        res.json(conversation);
    }
    catch (error) {
        console.error("GET CONVERSATION ERROR:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
exports.getASingleConversation = getASingleConversation;
