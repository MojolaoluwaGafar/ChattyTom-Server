"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAsRead = exports.getMessages = exports.sendMessage = void 0;
const MessageService_1 = require("../Services/MessageService");
// send message
const sendMessage = async (req, res) => {
    try {
        const senderId = req.userId;
        if (!senderId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { conversationId, content } = req.body;
        if (!conversationId || !content) {
            return res.status(400).json({ error: "conversationId and content required" });
        }
        const message = await (0, MessageService_1.SendMessage)(conversationId, senderId, content);
        return res.status(201).json(message);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.sendMessage = sendMessage;
// get messages
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const data = await (0, MessageService_1.getMessagesWithParticipants)(conversationId);
        return res.json(data);
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.getMessages = getMessages;
// mark as read
const markAsRead = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const { conversationId } = req.params;
        await (0, MessageService_1.markConversationAsRead)(conversationId, userId);
        return res.json({ message: "Conversation marked as read" });
    }
    catch (err) {
        return res.status(400).json({ error: err.message });
    }
};
exports.markAsRead = markAsRead;
